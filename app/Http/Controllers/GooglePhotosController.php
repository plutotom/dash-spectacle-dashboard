<?php

namespace App\Http\Controllers;

use App\Models\User;
use Google\Photos\Library\V1\PhotosLibraryResourceFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Revolution\Google\Photos\Facades\Photos;

class GooglePhotosController extends Controller
{
    public function getRandomPhoto(): JsonResponse
    {
        try {
            $token = User::whereNotNull('google_refresh_token')->first()->google_refresh_token;
            // Initialize Photos with token
            $photos = Photos::withToken($token);

            // List media items (this returns a PagedListResponse)
            $mediaItems = $photos->listMediaItems();

            // Convert to array and get random item
            $items = iterator_to_array($mediaItems->iterateAllElements());

            if (empty($items)) {
                return response()->json([
                    'success' => false,
                    'error' => 'No photos found in Google Photos library',
                ], 404);
            }

            $randomItem = $items[array_rand($items)];

            return response()->json([
                'success' => true,
                'url' => $randomItem->getBaseUrl(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a random photo from the dashboard album
     * see https://github.com/kawax/laravel-google-photos/tree/master?tab=readme-ov-file for details
     */
    public function getRandomPhotoFromDashboardAlbum(): JsonResponse
    {
        try {
            $token = User::whereNotNull('google_refresh_token')->first()->google_refresh_token;
            $photos = Photos::withToken($token);
            $albumId = config('services.google.photos.album_id');

            // First verify the album exists
            try {
                $album = $photos->getAlbum($albumId);
                if (! $album) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Album not found',
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'error' => 'Error accessing album: '.$e->getMessage(),
                ], 500);
            }

            // Search for media items in the album
            $mediaItems = $photos->search([
                'albumId' => $albumId,
                'pageSize' => 100,
            ]);

            // Convert to array and check if we have items
            $items = iterator_to_array($mediaItems->iterateAllElements());

            if (empty($items)) {
                return response()->json([
                    'success' => false,
                    'error' => 'No photos found in album. Album ID: '.$albumId,
                ], 404);
            }

            $randomItem = $items[array_rand($items)];

            return response()->json([
                'success' => true,
                'url' => $randomItem->getBaseUrl().'=w'.$randomItem->getMediaMetadata()->getWidth().'-h'.$randomItem->getMediaMetadata()->getHeight(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function listAlbums(): JsonResponse
    {
        try {
            // Get token from your user's stored refresh token
            $token = auth()->user()->google_refresh_token;

            // Initialize Photos with token
            $photos = Photos::withToken($token);

            // List albums (this returns a PagedListResponse)
            $albums = $photos->listAlbums();

            // Transform album objects into arrays with the data we need
            $albumsArray = array_map(function ($album) {
                return [
                    'id' => $album->getId(),
                    'title' => $album->getTitle(),
                    'productUrl' => $album->getProductUrl(),
                    'mediaItemsCount' => $album->getMediaItemsCount(),
                    'coverPhotoUrl' => $album->getCoverPhotoBaseUrl(),
                ];
            }, iterator_to_array($albums->iterateAllElements()));

            return response()->json([
                'success' => true,
                'albums' => array_values($albumsArray),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showUploadPage()
    {
        try {
            $token = auth()->user()->google_refresh_token;
            if(!$token) {
                return Inertia::render('GooglePhotos/UploadPhotos', [
                    'albums' => [],
                    'errors' => ['error' => 'No token found to access Google Photos albums'],
                ]); 
            }
            $photos = Photos::withToken($token);
            $albums = $photos->listAlbums();
            $albumsArray = array_map(function ($album) {
                return [
                    'id' => $album->getId(),
                    'title' => $album->getTitle(),
                    'productUrl' => $album->getProductUrl(),
                    'mediaItemsCount' => $album->getMediaItemsCount(),
                    'coverPhotoUrl' => $album->getCoverPhotoBaseUrl(),
                ];
            }, iterator_to_array($albums->iterateAllElements()));

            return Inertia::render('GooglePhotos/UploadPhotos', [
                'albums' => array_values($albumsArray),
            ]);
        } catch (\Exception $e) {
            // Optionally handle error, e.g. redirect with error message
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function createAlbum(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        try {
            $token = auth()->user()->google_refresh_token;
            $photos = Photos::withToken($token);
            $newAlbum = Photos::withToken($token)->createAlbum(PhotosLibraryResourceFactory::album($request->name));
            // Expect Google\Photos\Types\Album

            return redirect()->route('google-photos.upload')->with('success', 'Album created!');
        } catch (\Exception $e) {
            return redirect()->route('google-photos.upload')->withErrors(['album_error' => $e->getMessage()]);
        }
    }

    public function uploadPhotos(Request $request)
    {
        $request->validate([
            'albumId' => 'required|string',
            'photos' => 'required|array',
            'photos.*' => 'file|mimes:jpeg,png,jpg,gif,webp,bmp,svg,heic,heif',
        ]);

        $token = auth()->user()->google_refresh_token;
        $photosApi = Photos::withToken($token);
        $albumId = $request->input('albumId');
        $files = array_filter($request->file('photos'), fn ($file) => $file instanceof \Illuminate\Http\UploadedFile);

        $results = [];
        $uploadTokens = [];

        foreach ($files as $file) {
            try {
                $fileContents = file_get_contents($file->getRealPath());
                $fileName = $file->getClientOriginalName();
                $uploadToken = $photosApi->upload($fileContents, $fileName);
                $uploadTokens[] = $uploadToken;
                $results[] = [
                    'name' => $fileName,
                    'success' => true,
                    'uploadToken' => $uploadToken,
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'name' => $file->getClientOriginalName(),
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        // Batch create media items in the album
        try {
            if (! empty($uploadTokens)) {
                $batchResult = $photosApi->batchCreate($uploadTokens, ['albumId' => $albumId]);
                $results[] = [
                    'batchCreate' => $batchResult,
                ];
            }
        } catch (\Exception $e) {
            $results[] = [
                'batchCreateError' => $e->getMessage(),
            ];
        }

        return redirect()->back()->with('success', 'Photos uploaded successfully!')->with('results', $results);
    }

    public function uploadPhotosLocal(Request $request)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'file|mimes:jpeg,png,jpg,gif,webp,bmp,svg,heic,heif',
        ]);

        $files = array_filter($request->file('photos'), fn ($file) => $file instanceof \Illuminate\Http\UploadedFile);
        $results = [];

        foreach ($files as $file) {
            try {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('photos', $fileName, 'public');
                
                $results[] = [
                    'name' => $file->getClientOriginalName(),
                    'success' => true,
                    'path' => $path,
                    'url' => asset('storage/' . $path)
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'name' => $file->getClientOriginalName(),
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return redirect()->back()->with('success', 'Photos uploaded successfully!')->with('results', $results);
    }

    public function getRandomLocalPhoto(): JsonResponse
    {
        try {
            $photosPath = storage_path('app/public/photos');
            
            // Check if directory exists and has files
            if (!is_dir($photosPath) || count(glob($photosPath . '/*')) === 0) {
                return response()->json([
                    'success' => false,
                    'error' => 'No local photos found',
                ], 404);
            }

            // Get all files in the photos directory
            $files = glob($photosPath . '/*');
            
            // Get a random file
            $randomFile = $files[array_rand($files)];
            
            // Get file info
            $fileInfo = getimagesize($randomFile);
            $width = $fileInfo[0] ?? 1920; // Default width if not available
            
            // Get the relative path for the URL
            $relativePath = 'storage/photos/' . basename($randomFile);
            
            return response()->json([
                'success' => true,
                'url' => asset($relativePath),
                'media_metadata_width' => $width,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
