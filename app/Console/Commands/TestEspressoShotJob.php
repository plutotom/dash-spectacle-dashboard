<?php

namespace App\Console\Commands;

use App\Jobs\ProcessEspressoShot;
use Illuminate\Console\Command;

class TestEspressoShotJob extends Command
{
    protected $signature = 'espresso:test-job {--dry-run}';

    protected $description = 'Test the espresso shot processing job manually';

    public function handle()
    {
        $this->info('Starting espresso shot job test...');

        try {
            // Capture logs during job execution
            $dryRun = $this->option('dry-run');

            // Dispatch the job synchronously (not queued)
            ProcessEspressoShot::dispatchSync($dryRun);

            $this->info('✅ Job completed successfully!');

            // Show recent logs
            $this->info('Recent logs:');
            $logFile = storage_path('logs/laravel.log');
            if (file_exists($logFile)) {
                $lines = file($logFile);
                $recentLines = array_slice($lines, -20); // Last 20 lines
                foreach ($recentLines as $line) {
                    if (str_contains($line, 'espresso') || str_contains($line, 'shot')) {
                        $this->line(trim($line));
                    }
                }
            }

        } catch (\Exception $e) {
            $this->error('❌ Job failed: '.$e->getMessage());
            $this->error('Stack trace: '.$e->getTraceAsString());
        }
    }
}
