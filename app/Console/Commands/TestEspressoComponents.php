<?php

namespace App\Console\Commands;

use App\Models\EspressoShot;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class TestEspressoComponents extends Command
{
    protected $signature = 'espresso:test-components {--component=all} {--dry-run} {--shot-id=}';

    protected $description = 'Test individual components of the espresso system';

    private string $gaggiuinoUrl;

    private string $homeAssistantUrl;

    private string $homeAssistantToken;

    private string $espressoMachineEntityId;

    private bool $dryRun;

    public function __construct()
    {
        parent::__construct();
        $this->gaggiuinoUrl = config('services.gaggiuino.url', 'http://gaggiuino.local');
        $this->homeAssistantUrl = config('services.homeAssistant.url');
        $this->homeAssistantToken = config('services.homeAssistant.token');
        $this->espressoMachineEntityId = config('services.homeAssistant.espresso_machine_entity_id');
    }

    public function handle()
    {
        $component = $this->option('component');
        $this->dryRun = $this->option('dry-run');

        $this->info("Testing component: {$component}".($this->dryRun ? ' (DRY RUN)' : ''));

        switch ($component) {
            case 'gaggiuino':
                $this->testGaggiuinoConnection();
                break;
            case 'homeassistant':
                $this->testHomeAssistantConnection();
                break;
            case 'database':
                $this->testDatabase();
                break;
            case 'turn-on':
                $this->testTurnOnEspressoMachine();
                break;
            case 'turn-off':
                $this->testTurnOffEspressoMachine();
                break;
            case 'latest-shot':
                $this->testGetLatestShotId();
                break;
            case 'process-shot':
                $shotId = $this->option('shot-id') ?: $this->ask('Enter shot ID to process:');
                $this->testProcessShot((int) $shotId);
                break;
            case 'process-missing':
                $this->testProcessMissingShots();
                break;
            case 'sync-all':
                $this->testSyncAllShots();
                break;
            case 'all':
            default:
                $this->testGaggiuinoConnection();
                $this->testHomeAssistantConnection();
                $this->testDatabase();
                break;
        }
    }

    private function testGaggiuinoConnection()
    {
        $this->info('Testing Gaggiuino connection...');

        try {
            $response = Http::timeout(10)->get("{$this->gaggiuinoUrl}/api/shots/latest");

            if ($response->successful()) {
                $data = $response->json();
                $this->info('data: '.json_encode($data)); // e.g. data: [{"lastShotId":"69"}] or {"lastShotId":"69"}

                // Handle both array-wrapped and direct object responses
                if (is_array($data) && isset($data[0]['lastShotId'])) {
                    $lastShotId = $data[0]['lastShotId'];
                } elseif (is_array($data) && isset($data['lastShotId'])) {
                    $lastShotId = $data['lastShotId'];
                } elseif (isset($data['id'])) {
                    $lastShotId = $data['id'];
                } else {
                    $lastShotId = 'unknown';
                }

                $this->info('✅ Gaggiuino connection successful! Latest shot ID: '.$lastShotId);
            } else {
                $this->error('❌ Gaggiuino connection failed: '.$response->status());
            }
        } catch (\Exception $e) {
            $this->error('❌ Gaggiuino connection error: '.$e->getMessage());
        }
    }

    private function testHomeAssistantConnection()
    {
        $this->info('Testing Home Assistant connection...');

        if (! $this->homeAssistantUrl || ! $this->homeAssistantToken) {
            $this->error('❌ Home Assistant URL or token not configured');

            return;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->homeAssistantToken}",
                'Content-Type' => 'application/json',
            ])->get("{$this->homeAssistantUrl}/api/");

            if ($response->successful()) {
                $this->info('✅ Home Assistant connection successful!');

                // Test if espresso machine entity exists
                if ($this->espressoMachineEntityId) {
                    $this->info("Espresso machine entity ID: {$this->espressoMachineEntityId}");
                } else {
                    $this->warn('⚠️ Espresso machine entity ID not configured');
                }
            } else {
                $this->error('❌ Home Assistant connection failed: '.$response->status());
            }
        } catch (\Exception $e) {
            $this->error('❌ Home Assistant connection error: '.$e->getMessage());
        }
    }

    private function testDatabase()
    {
        $this->info('Testing database connection...');

        try {
            $count = EspressoShot::count();
            $this->info("✅ Database connection successful! Current shots: {$count}");

            if ($count > 0) {
                $latest = EspressoShot::latest('id')->first();
                $this->info("Latest shot ID in database: {$latest->id}");
                $this->info("Latest shot timestamp: {$latest->timestamp}");
            }
        } catch (\Exception $e) {
            $this->error('❌ Database connection error: '.$e->getMessage());
        }
    }

    private function testTurnOnEspressoMachine()
    {
        $this->info('Testing: Turn on espresso machine');

        if ($this->dryRun) {
            $this->info('DRY RUN: Would turn on espresso machine');

            return;
        }

        if (! $this->homeAssistantUrl || ! $this->homeAssistantToken || ! $this->espressoMachineEntityId) {
            $this->error('❌ Home Assistant configuration missing');

            return;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->homeAssistantToken}",
                'Content-Type' => 'application/json',
            ])->post("{$this->homeAssistantUrl}/api/services/switch/turn_on", [
                'entity_id' => $this->espressoMachineEntityId,
            ]);

            if ($response->successful()) {
                $this->info('✅ Espresso machine turned on successfully');
            } else {
                $this->error("❌ Failed to turn on espresso machine: HTTP {$response->status()} - {$response->body()}");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error turning on espresso machine: {$e->getMessage()}");
        }
    }

    private function testTurnOffEspressoMachine()
    {
        $this->info('Testing: Turn off espresso machine');

        if ($this->dryRun) {
            $this->info('DRY RUN: Would turn off espresso machine');

            return;
        }

        if (! $this->homeAssistantUrl || ! $this->homeAssistantToken || ! $this->espressoMachineEntityId) {
            $this->error('❌ Home Assistant configuration missing');

            return;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->homeAssistantToken}",
                'Content-Type' => 'application/json',
            ])->post("{$this->homeAssistantUrl}/api/services/switch/turn_off", [
                'entity_id' => $this->espressoMachineEntityId,
            ]);

            if ($response->successful()) {
                $this->info('✅ Espresso machine turned off successfully');
            } else {
                $this->error("❌ Failed to turn off espresso machine: HTTP {$response->status()} - {$response->body()}");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error turning off espresso machine: {$e->getMessage()}");
        }
    }

    private function testGetLatestShotId()
    {
        $this->info('Testing: Get latest shot ID from espresso machine');

        try {
            $this->testTurnOnEspressoMachine();
            sleep(5);
            $response = Http::timeout(10)->get("{$this->gaggiuinoUrl}/api/shots/latest");

            if ($response->successful()) {
                $data = $response->json();
                $this->info('Raw response: '.json_encode($data));

                // Handle different response formats
                $latestShotId = null;
                if (is_array($data) && isset($data[0]['lastShotId'])) {
                    $latestShotId = $data[0]['lastShotId'];
                } elseif (is_array($data) && isset($data['lastShotId'])) {
                    $latestShotId = $data['lastShotId'];
                } elseif (isset($data['id'])) {
                    $latestShotId = $data['id'];
                }

                if ($latestShotId) {
                    $this->info("✅ Latest shot ID: {$latestShotId}");
                } else {
                    $this->warn('⚠️ Could not determine latest shot ID from response');
                }
            } else {
                $this->error("❌ Failed to get latest shot ID: HTTP {$response->status()} - {$response->body()}");
            }
            $this->testTurnOffEspressoMachine();
        } catch (\Exception $e) {
            $this->error("❌ Error getting latest shot ID: {$e->getMessage()}");
            $this->testTurnOffEspressoMachine();
        }
    }

    private function testProcessShot(int $shotId)
    {
        $this->info("Testing: Process shot ID {$shotId}");

        try {
            $response = Http::timeout(10)->get("{$this->gaggiuinoUrl}/api/shots/{$shotId}");

            if ($response->successful()) {
                $shotData = $response->json();
                $this->info('✅ Shot data retrieved successfully');
                $this->info("Shot ID: {$shotData['id']}");
                $this->info("Timestamp: {$shotData['timestamp']}");
                $this->info("Duration: {$shotData['duration']} seconds");
                $this->info('Profile: '.($shotData['profile']['name'] ?? 'Unknown'));

                if ($this->dryRun) {
                    $this->info('DRY RUN: Would save shot to database');
                } else {
                    // Check if shot already exists
                    $existingShot = EspressoShot::find($shotId);
                    if ($existingShot) {
                        $this->warn("⚠️ Shot ID {$shotId} already exists in database");
                    } else {
                        // Create the shot
                        EspressoShot::create([
                            'id' => $shotData['id'],
                            'timestamp' => $shotData['timestamp'],
                            'duration' => $shotData['duration'],
                            'datapoints' => $shotData['datapoints'],
                            'profile' => $shotData['profile'],
                        ]);
                        $this->info("✅ Shot ID {$shotId} saved to database");
                    }
                }
            } else {
                $this->error("❌ Failed to fetch shot {$shotId}: HTTP {$response->status()} - {$response->body()}");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error processing shot {$shotId}: {$e->getMessage()}");
        }
    }

    private function testProcessMissingShots()
    {
        $this->info('Testing: Process missing shots');

        $this->testTurnOnEspressoMachine();
        sleep(5);

        try {
            // Get latest shot from machine
            $machineResponse = Http::timeout(10)->get("{$this->gaggiuinoUrl}/api/shots/latest");
            if (! $machineResponse->successful()) {
                $this->error('❌ Failed to get latest shot from machine');

                return;
            }

            $machineData = $machineResponse->json();

            // Handle different response formats
            $latestMachineId = null;
            if (is_array($machineData) && isset($machineData[0]['lastShotId'])) {
                $latestMachineId = (int) $machineData[0]['lastShotId'];
            } elseif (is_array($machineData) && isset($machineData['lastShotId'])) {
                $latestMachineId = (int) $machineData['lastShotId'];
            } elseif (isset($machineData['id'])) {
                $latestMachineId = (int) $machineData['id'];
            }

            if (! $latestMachineId) {
                $this->error('❌ Could not determine latest machine shot ID');

                return;
            }

            // Get highest local shot ID
            $latestLocalShot = EspressoShot::orderBy('id', 'desc')->first();
            $highestLocalId = $latestLocalShot ? $latestLocalShot->id : 0;

            $this->info("Latest machine shot ID: {$latestMachineId}");
            $this->info("Highest local shot ID: {$highestLocalId}");

            $missingShots = range($highestLocalId + 1, $latestMachineId);

            if (empty($missingShots)) {
                $this->info('✅ No missing shots to process');
            } else {
                $this->info('Found '.count($missingShots).' missing shots: '.implode(', ', $missingShots));

                if ($this->dryRun) {
                    $this->info('DRY RUN: Would process missing shots');
                } else {
                    $successCount = 0;
                    $errorCount = 0;

                    foreach ($missingShots as $shotId) {
                        try {
                            $this->testProcessShot($shotId);
                            $successCount++;
                        } catch (\Exception $e) {
                            $this->error("Failed to process shot {$shotId}: {$e->getMessage()}");
                            $errorCount++;
                        }
                    }

                    $this->info("✅ Processing complete: {$successCount} successful, {$errorCount} failed");
                }
            }
            $this->testTurnOffEspressoMachine();
        } catch (\Exception $e) {
            $this->error("❌ Error processing missing shots: {$e->getMessage()}");
            $this->testTurnOffEspressoMachine();
        }
    }

    private function testSyncAllShots()
    {
        $this->info('Testing: Sync all shots from machine to database');

        try {
            // Get latest shot from machine
            $machineResponse = Http::timeout(10)->get("{$this->gaggiuinoUrl}/api/shots/latest");
            if (! $machineResponse->successful()) {
                $this->error('❌ Failed to get latest shot from machine');

                return;
            }

            $machineData = $machineResponse->json();

            // Handle different response formats
            $latestMachineId = null;
            if (is_array($machineData) && isset($machineData[0]['lastShotId'])) {
                $latestMachineId = (int) $machineData[0]['lastShotId'];
            } elseif (is_array($machineData) && isset($machineData['lastShotId'])) {
                $latestMachineId = (int) $machineData['lastShotId'];
            } elseif (isset($machineData['id'])) {
                $latestMachineId = (int) $machineData['id'];
            }

            if (! $latestMachineId) {
                $this->error('❌ Could not determine latest machine shot ID');

                return;
            }

            $this->info("Latest machine shot ID: {$latestMachineId}");

            if ($this->dryRun) {
                $this->info('DRY RUN: Would sync all shots from 1 to {$latestMachineId}');
            } else {
                $successCount = 0;
                $errorCount = 0;
                $existingCount = 0;

                // Process all shots from 1 to latest
                for ($shotId = 1; $shotId <= $latestMachineId; $shotId++) {
                    try {
                        // Check if shot already exists
                        $existingShot = EspressoShot::find($shotId);
                        if ($existingShot) {
                            $existingCount++;

                            continue;
                        }

                        $this->testProcessShot($shotId);
                        $successCount++;
                    } catch (\Exception $e) {
                        $this->error("Failed to process shot {$shotId}: {$e->getMessage()}");
                        $errorCount++;
                    }
                }

                $this->info("✅ Sync complete: {$successCount} new shots, {$existingCount} already existed, {$errorCount} failed");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error syncing all shots: {$e->getMessage()}");
        }
    }
}
