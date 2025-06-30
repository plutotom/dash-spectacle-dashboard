<?php

namespace App\Console;

use App\Jobs\ProcessEspressoShot;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // ! not going to run this for now
        // $schedule->command('notion:sync-prayer-requests')->everyFifteenMinutes();
        // ... existing scheduled tasks ...

        // Schedule espresso shot processing daily at 3 PM
        $schedule->job(new ProcessEspressoShot)
            ->dailyAt('15:00')
            ->withoutOverlapping()
            ->onFailure(function () {
                Log::error('Espresso shot processing job failed');
            });
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
