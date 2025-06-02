<?php

namespace App\Console\Commands;

use App\Http\Controllers\Api\PrayerRequestController;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncPrayerRequestsFromNotion extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notion:sync-prayer-requests {--force : Force sync even if cache is valid}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync prayer requests from Notion database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting prayer request sync from Notion...');

        try {
            $controller = new PrayerRequestController;
            $result = $controller->fetchFromNotion();

            if ($result->getStatusCode() === 200) {
                $data = json_decode($result->getContent(), true);

                if ($data['status'] === 'completed') {
                    $this->info(sprintf(
                        'Sync completed: %d processed, %d synced successfully, %d errors',
                        $data['total_processed'],
                        $data['successfully_synced'],
                        $data['errors']
                    ));

                    if ($data['errors'] > 0) {
                        $this->warn('Errors occurred during sync:');
                        foreach ($data['error_messages'] as $error) {
                            $this->error($error);
                        }
                    }
                } else {
                    $this->error('Sync failed: '.($data['message'] ?? 'Unknown error'));
                }
            } else {
                $this->error('Failed to sync prayer requests. Check the logs for details.');
            }
        } catch (\Exception $e) {
            $this->error('Fatal error during sync: '.$e->getMessage());
            Log::error('Fatal error in SyncPrayerRequestsFromNotion: '.$e->getMessage());
        }
    }
}
