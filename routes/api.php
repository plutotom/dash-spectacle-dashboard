<?php

use App\Http\Controllers\Api\CalendarEventController;
use App\Http\Controllers\Api\WeatherController;
use App\Http\Controllers\GooglePhotosController;
use App\Http\Controllers\HabitifyController;
use Illuminate\Support\Facades\Route;

Route::get('/calendar-events', [CalendarEventController::class, 'index']);

Route::get('/weather/current', [WeatherController::class, 'current']);
Route::get('/weather/forecast', [WeatherController::class, 'forecast']);

// Messages API removed in favor of web-authenticated routes

// Route::get('/random-photo', [GooglePhotosController::class, 'getRandomPhoto'])
//     ->name('api.random-photo');

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('habitify')->group(function () {
        Route::get('/habits', [HabitifyController::class, 'index']);
        Route::get('/weekly-progress', [HabitifyController::class, 'weeklyProgress']);
    });
});
