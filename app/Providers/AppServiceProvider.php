<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Check if LogViewer facade is available before using it
        if (class_exists('Opcodes\LogViewer\Facades\LogViewer')) {
            \Opcodes\LogViewer\Facades\LogViewer::auth(function ($request) {
                return
                $request->user() &&
                str_contains($request->user()->email, 'plutotom');
            });
        }
    }
}
