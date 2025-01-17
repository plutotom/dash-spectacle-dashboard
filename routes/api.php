<?php

use App\Http\Controllers\Api\CalendarEventController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\WeatherController;
use App\Http\Controllers\GooglePhotosController;
use App\Http\Middleware\CheckApiToken;
use Illuminate\Support\Facades\Route;

Route::get('/calendar-events', [CalendarEventController::class, 'index']);

Route::get('/weather/current', [WeatherController::class, 'current']);
Route::get('/weather/forecast', [WeatherController::class, 'forecast']);

Route::get('/messages/{count?}', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store'])->middleware(CheckApiToken::class);

// Route::get('/random-photo', [GooglePhotosController::class, 'getRandomPhoto'])
//     ->name('api.random-photo');
