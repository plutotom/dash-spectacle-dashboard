<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
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

            // dd($mediaItems);
            // Convert to array and get random item
            $items = iterator_to_array($mediaItems->iterateAllElements());
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
            // Get token from your user's stored refresh token
            // $token = auth()->user()->google_refresh_token;
            $token = User::whereNotNull('google_refresh_token')->first()->google_refresh_token;

            // Initialize Photos with token
            $photos = Photos::withToken($token);
            $albumId = config('services.google.photos.album_id');

            $mediaItems = $photos->search(['albumId' => $albumId, 'pageSize' => 100]);
            // Convert to array and get random item
            $items = iterator_to_array($mediaItems->iterateAllElements());
            $randomItem = $items[array_rand($items)];

            return response()->json([
                'url' => $randomItem->getBaseUrl().'=w'.$randomItem->getMediaMetadata()->getWidth().'-h'.$randomItem->getMediaMetadata()->getHeight(),
                // 'media_metadata_width' => $randomItem->getMediaMetadata()->getWidth(),
                // 'media_metadata_height' => $randomItem->getMediaMetadata()->getHeight(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
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
}
