<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CalendarEventController;
use App\Http\Controllers\Api\WeatherController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Middleware\CheckApiToken;

Route::get('/calendar-events', [CalendarEventController::class, 'index']);

Route::get('/weather/current', [WeatherController::class, 'current']);
Route::get('/weather/forecast', [WeatherController::class, 'forecast']);

Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store'])->middleware(CheckApiToken::class);
