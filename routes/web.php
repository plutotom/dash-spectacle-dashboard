<?php

use App\Http\Controllers\Api\NotionWebhookController;
use App\Http\Controllers\Api\PrayerRequestController;
use App\Http\Controllers\Api\SettingController as ApiSettingController;
use App\Http\Controllers\ApiTokenController;
use App\Http\Controllers\EspressoShotController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\GooglePhotosController;
use App\Http\Controllers\HabitifyController;
use App\Http\Controllers\HaDashboardController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UsersController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');

    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
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

    Route::get('/messages', [MessagesController::class, 'index'])->name('messages.index');
    Route::post('/messages', [MessagesController::class, 'store'])->name('messages.store');
    Route::put('/messages/{message}', [MessagesController::class, 'update'])->name('messages.update');
    Route::delete('/messages/{message}', [MessagesController::class, 'destroy'])->name('messages.destroy');

    Route::get('/users', [UsersController::class, 'index'])->name('users.index');
    Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');

    // Prayer Requests
    Route::get('/prayer-requests/manage', function () {
        return Inertia::render('PrayerRequests/Index');
    })->name('prayer-requests.manage');
    Route::post('/prayer-requests', [PrayerRequestController::class, 'store'])->name('prayer-requests.store');
    Route::put('/prayer-requests/{prayerRequest}', [PrayerRequestController::class, 'update'])->name('prayer-requests.update');
    Route::delete('/prayer-requests/{prayerRequest}', [PrayerRequestController::class, 'destroy'])->name('prayer-requests.destroy');
    Route::post('/prayer-requests/{prayerRequest}/mark-answered', [PrayerRequestController::class, 'markAnswered'])->name('prayer-requests.mark-answered');
    Route::post('/prayer-requests/{prayerRequest}/mark-unanswered', [PrayerRequestController::class, 'markUnanswered'])->name('prayer-requests.mark-unanswered');
    Route::get('/prayer-requests/manage/data', [PrayerRequestController::class, 'manage'])->name('prayer-requests.manage.data');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
});

// Public messages feed
Route::get('/messages/feed', [MessagesController::class, 'feed'])->name('messages.feed');
Route::get('/prayer-requests', [PrayerRequestController::class, 'index'])->name('prayer-requests.index');
Route::get('/prayer-requests/dashboard', [PrayerRequestController::class, 'dashboard'])->name('prayer-requests.dashboard');
Route::post('/prayer-requests/fetch', [PrayerRequestController::class, 'fetchFromNotion'])->name('prayer-requests.fetch');

Route::get('/api/settings/public', [ApiSettingController::class, 'public'])->name('api.settings.public');

Route::get('/api/random-photo', [GooglePhotosController::class, 'getRandomPhoto'])
    ->name('api.random-photo');
Route::get('/api/albums', [GooglePhotosController::class, 'listAlbums'])
    ->name('api.albums');
Route::get('/api/random-photo-from-dashboard-album', [GooglePhotosController::class, 'getRandomPhotoFromDashboardAlbum'])
    ->name('api.random-photo-from-dashboard-album');
Route::get('/api/random-photo-local', [GooglePhotosController::class, 'getRandomLocalPhoto'])
    ->name('api.random-photo-local');

Route::post('/api/notion-webhook', [NotionWebhookController::class, 'handle']);

Route::get('/google-photos/upload', [GooglePhotosController::class, 'showUploadPage'])
    ->middleware(['auth', 'verified'])
    ->name('google-photos.upload');

Route::post('/api/upload-photos', [GooglePhotosController::class, 'uploadPhotos'])
    ->middleware(['auth', 'verified'])
    ->name('api.upload-photos');

Route::post('/api/create-album', [GooglePhotosController::class, 'createAlbum'])->middleware(['auth', 'verified'])
    ->name('google-photos.create-album');

Route::post('/api/upload-photos-local', [GooglePhotosController::class, 'uploadPhotosLocal'])
    ->middleware(['auth', 'verified'])
    ->name('api.upload-photos-local');

Route::get('/api/local-images', [GooglePhotosController::class, 'listLocalImages'])->middleware(['auth', 'verified']);
Route::delete('/api/local-images/{filename}', [GooglePhotosController::class, 'deleteLocalPhoto'])->middleware(['auth', 'verified']);

Route::group(['prefix' => 'habitify', 'middleware' => ['auth', 'verified']], function () {
    Route::get('/', [HabitifyController::class, 'index'])->name('habitify.index');
});

Route::prefix('shots')->group(function () {
    Route::get('/', [EspressoShotController::class, 'index'])->name('shots.index');
    Route::get('/latest', [EspressoShotController::class, 'latest'])->name('shots.latest');
    Route::post('/sync', [EspressoShotController::class, 'sync'])->name('shots.sync');
    Route::post('/start', [EspressoShotController::class, 'start'])->name('shots.start');
    Route::get('/{id}', [EspressoShotController::class, 'show'])->name('shots.show');
});

// Route::get('/test-broadcast', [App\Http\Controllers\Api\MessageController::class, 'testBroadcast']);

// need to make a example page that has the event listener that shows the real time mesages as they are broadcasted
// Route::get('/example', function () {
//     // create a blade here that has the event listener that shows the real time mesages as they are broadcasted
//     return view('example');
// })->name('example');

require __DIR__.'/auth.php';
