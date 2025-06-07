<?php

use App\Http\Controllers\Api\NotionWebhookController;
use App\Http\Controllers\Api\PrayerRequestController;
use App\Http\Controllers\ApiTokenController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\GooglePhotosController;
use App\Http\Controllers\HabitifyController;
use App\Http\Controllers\HaDashboardController;
use App\Http\Controllers\MessageManagementController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/haDashboard', [HaDashboardController::class, 'index'])->name('ha.dashboard');
Route::get('my-wife/thesis', function () {
    return Inertia::render('my-wife/Thesis');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/api-tokens', [ApiTokenController::class, 'index'])->name('api-tokens.index');
    Route::post('/api-tokens', [ApiTokenController::class, 'store'])->name('api-tokens.store');
    Route::put('/api-tokens/{token}', [ApiTokenController::class, 'update'])->name('api-tokens.update');
    Route::delete('/api-tokens/{token}', [ApiTokenController::class, 'destroy'])->name('api-tokens.destroy');

    // Google Photos routes
    Route::get('/google/setup', [GoogleAuthController::class, 'setup'])
        ->name('google.setup');
    Route::get('/google/redirect', [GoogleAuthController::class, 'redirectToGoogle'])
        ->name('google.redirect');
    Route::get('/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])
        ->name('google.callback');
    Route::post('/google/reset', [GoogleAuthController::class, 'resetGoogleAuth'])
        ->name('google.reset');

    Route::get('/messages', [MessageManagementController::class, 'index'])->name('messages.index');
    Route::delete('/messages/{message}', [MessageManagementController::class, 'destroy'])->name('messages.destroy');
    Route::put('/messages/{message}', [MessageManagementController::class, 'update'])->name('messages.update');

    // Prayer Requests
});
Route::get('/prayer-requests', [PrayerRequestController::class, 'index'])->name('prayer-requests.index');
Route::post('/prayer-requests/fetch', [PrayerRequestController::class, 'fetchFromNotion'])->name('prayer-requests.fetch');

Route::get('/api/random-photo', [GooglePhotosController::class, 'getRandomPhoto'])
    ->name('api.random-photo');
Route::get('/api/albums', [GooglePhotosController::class, 'listAlbums'])
    ->name('api.albums');
Route::get('/api/random-photo-from-dashboard-album', [GooglePhotosController::class, 'getRandomPhotoFromDashboardAlbum'])
    ->name('api.random-photo-from-dashboard-album');

Route::post('/api/notion-webhook', [NotionWebhookController::class, 'handle']);

Route::get('/google-photos/upload', [GooglePhotosController::class, 'showUploadPage'])
    ->middleware(['auth', 'verified'])
    ->name('google-photos.upload');

Route::post('/api/upload-photos', [GooglePhotosController::class, 'uploadPhotos'])
    ->middleware(['auth', 'verified'])
    ->name('api.upload-photos');

Route::post('/api/create-album', [GooglePhotosController::class, 'createAlbum'])->middleware(['auth', 'verified'])
    ->name('google-photos.create-album');

Route::group(['prefix' => 'habitify', 'middleware' => ['auth', 'verified']], function () {
    Route::get('/', [HabitifyController::class, 'index'])->name('habitify.index');
});

// Route::get('/test-broadcast', [App\Http\Controllers\Api\MessageController::class, 'testBroadcast']);

// need to make a example page that has the event listener that shows the real time mesages as they are broadcasted
// Route::get('/example', function () {
//     // create a blade here that has the event listener that shows the real time mesages as they are broadcasted
//     return view('example');
// })->name('example');

require __DIR__.'/auth.php';
