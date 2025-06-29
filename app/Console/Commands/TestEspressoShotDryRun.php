<?php

namespace App\Console\Commands;

use App\Jobs\ProcessEspressoShot;
use Illuminate\Console\Command;

class TestEspressoShotDryRun extends Command
{
    protected $signature = 'espresso:dry-run';

    protected $description = 'Test the espresso shot processing job in dry run mode (no actual machine control)';

    public function handle()
    {
        $this->info('Starting espresso shot job dry run...');

        try {
            // Dispatch the job with dry run enabled
            ProcessEspressoShot::dispatchSync(true);
            $this->info('✅ Dry run completed successfully!');
        } catch (\Exception $e) {
            $this->error('❌ Dry run failed: '.$e->getMessage());
        }
    }
}
