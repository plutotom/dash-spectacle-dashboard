<?php

namespace App\Console\Commands;

use App\Jobs\ProcessEspressoShot;
use Illuminate\Console\Command;

class ScheduleEspressoShotProcessing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'espresso:schedule-processing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Schedule the espresso shot processing job to run daily at 3 PM';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Scheduling espresso shot processing job...');

        // Dispatch the job
        ProcessEspressoShot::dispatch();

        $this->info('Espresso shot processing job scheduled successfully!');
    }
}
