<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CalendarEventController;
use App\Http\Controllers\Api\WeatherController;

Route::get('/calendar-events', [CalendarEventController::class, 'index']);

Route::get('/weather/current', [WeatherController::class, 'current']);
Route::get('/weather/forecast', [WeatherController::class, 'forecast']);
