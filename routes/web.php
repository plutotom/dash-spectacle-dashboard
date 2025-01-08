<?php

use App\Http\Controllers\ApiTokenController;
use App\Http\Controllers\HaDashboardController;
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
});

Route::get('/test-broadcast', [App\Http\Controllers\Api\MessageController::class, 'testBroadcast']);

// need to make a example page that has the event listener that shows the real time mesages as they are broadcasted
Route::get('/example', function () {
    // create a blade here that has the event listener that shows the real time mesages as they are broadcasted
    return view('example');
});

require __DIR__.'/auth.php';
