<?php

namespace App\Jobs;

use App\Models\EspressoShot;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessEspressoShot implements ShouldQueue
{
    use Queueable;

    // ? some info on the API.

    // Handles shot persistence (streamed upload).
    // Used to log espresso shot data.
    // GET /api/shots/latest
    // Description:
    // returns the last shot id - short ids are incremental.

    // Handles retrieving the identifier for the last history shot.
    // GET /api/shots/:id
    // Description:

    // http://gaggiuino.local/api/shots/23

    //

    private string $gaggiuinoUrl;

    private string $homeAssistantUrl;

    private string $homeAssistantToken;

    private string $espressoMachineEntityId;

    private bool $dryRun;

    /**
     * Create a new job instance.
     */
    public function __construct(bool $dryRun = false)
    {
        $this->dryRun = $dryRun;
        $this->gaggiuinoUrl = config('services.gaggiuino.url', 'http://gaggiuino.local');
        $this->homeAssistantUrl = config('services.homeAssistant.url');
        $this->homeAssistantToken = config('services.homeAssistant.token');
        $this->espressoMachineEntityId = config('services.homeAssistant.espresso_machine_entity_id');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Starting espresso shot processing job'.($this->dryRun ? ' (DRY RUN)' : ''));

            if (! $this->dryRun) {
                // Step 1: Turn on the espresso machine
                $this->turnOnEspressoMachine();
                sleep(10);
            }

            // Step 3: Get the latest shot ID from the espresso machine
            $latestShotId = $this->getLatestShotId();

            if (! $latestShotId) {
                Log::warning('Could not retrieve latest shot ID from espresso machine');
                if (! $this->dryRun) {
                    $this->turnOffEspressoMachine();
                }

                return;
            }

            // Step 4: Get the highest shot ID from our database
            $highestLocalShotId = $this->getHighestLocalShotId();

            // Step 5: Process missing shots
            $this->processMissingShots($highestLocalShotId, $latestShotId);

            if (! $this->dryRun) {
                // Step 6: Turn off the espresso machine
                $this->turnOffEspressoMachine();
            }

            Log::info('Espresso shot processing job completed successfully');

        } catch (\Exception $e) {
            Log::error('Error in espresso shot processing job: '.$e->getMessage());

            if (! $this->dryRun) {
                try {
                    $this->turnOffEspressoMachine();
                } catch (\Exception $turnOffError) {
                    Log::error('Failed to turn off espresso machine: '.$turnOffError->getMessage());
                }
            }

            throw $e;
        }
    }

    /**
     * Turn on the espresso machine via Home Assistant
     */
    private function turnOnEspressoMachine(): void
    {
        if ($this->dryRun) {
            Log::info('DRY RUN: Would turn on espresso machine');

            return;
        }
        Log::info('Turning on espresso machine');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->homeAssistantToken}",
            'Content-Type' => 'application/json',
        ])->post("{$this->homeAssistantUrl}/api/services/switch/turn_on", [
            'entity_id' => $this->espressoMachineEntityId,
        ]);

        if (! $response->successful()) {
            throw new \Exception('Failed to turn on espresso machine: '.$response->body());
        }

        Log::info('Espresso machine turned on successfully');
    }

    /**
     * Turn off the espresso machine via Home Assistant
     */
    private function turnOffEspressoMachine(): void
    {
        if ($this->dryRun) {
            Log::info('DRY RUN: Would turn off espresso machine');

            return;
        }
        Log::info('Turning off espresso machine');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->homeAssistantToken}",
            'Content-Type' => 'application/json',
        ])->post("{$this->homeAssistantUrl}/api/services/switch/turn_off", [
            'entity_id' => $this->espressoMachineEntityId,
        ]);

        if (! $response->successful()) {
            throw new \Exception('Failed to turn off espresso machine: '.$response->body());
        }

        Log::info('Espresso machine turned off successfully');
    }

    /**
     * Get the latest shot ID from the espresso machine
     */
    private function getLatestShotId(): ?int
    {
        Log::info('Getting latest shot ID from espresso machine');

        $response = Http::get("{$this->gaggiuinoUrl}/api/shots/latest");

        if (! $response->successful()) {
            Log::error('Failed to get latest shot ID: '.$response->body());

            return null;
        }

        $data = $response->json();

        // Handle different response formats like in your test command
        if (is_array($data) && isset($data[0]['lastShotId'])) {
            return (int) $data[0]['lastShotId'];
        } elseif (is_array($data) && isset($data['lastShotId'])) {
            return (int) $data['lastShotId'];
        } elseif (isset($data['id'])) {
            return (int) $data['id'];
        }

        Log::warning('Could not determine latest shot ID from response: '.json_encode($data));

        return null;
    }

    /**
     * Get the highest shot ID from our local database
     */
    private function getHighestLocalShotId(): int
    {
        Log::info('Getting highest local shot ID');

        $latestShot = EspressoShot::orderBy('id', 'desc')->first();

        return $latestShot ? $latestShot->id : 0;
    }

    /**
     * Process missing shots between the highest local ID and the latest machine ID
     */
    private function processMissingShots(int $highestLocalShotId, int $latestShotId): void
    {
        $missingShots = range($highestLocalShotId + 1, $latestShotId);

        if (empty($missingShots)) {
            Log::info('No missing shots to process');

            return;
        }

        Log::info('Processing '.count($missingShots).' missing shots');

        foreach ($missingShots as $shotId) {
            try {
                $this->processShot($shotId);
                Log::info("Successfully processed shot ID: {$shotId}");
            } catch (\Exception $e) {
                Log::error("Failed to process shot ID {$shotId}: ".$e->getMessage());
                // Continue with other shots even if one fails
            }
        }
    }

    /**
     * Process a single shot by fetching it from the machine and storing it locally
     */
    private function processShot(int $shotId): void
    {
        $response = Http::get("{$this->gaggiuinoUrl}/api/shots/{$shotId}");

        if (! $response->successful()) {
            throw new \Exception("Failed to fetch shot {$shotId}: ".$response->body());
        }

        $shotData = $response->json();

        if ($this->dryRun) {
            Log::info("DRY RUN: Would save shot ID {$shotId} to database");

            return;
        }

        // Create the shot in our database
        EspressoShot::create([
            'id' => $shotData['id'],
            'timestamp' => $shotData['timestamp'],
            'duration' => $shotData['duration'],
            'datapoints' => $shotData['datapoints'],
            'profile' => $shotData['profile'],
        ]);
    }
}

// here is an example shot to make the type off of.
// {
//     "id": 23,
//     "timestamp": 1748180909,
//     "duration": 383,
//     "datapoints": {
//         "timeInShot": [
//             1,
//             3,
//
//             382,
//             383
//         ],
//         "pressure": [
//             6,
//             6,
//             6,
//             6,
//             6,
//             6,
//             6,
//             7,
//             7,
//             8,
//             10,
//             11,
//
//             30,
//             30,
//             30
//         ],
//         "pumpFlow": [
//             0,
//             31,
//             31,
//             80,
//
//             9,
//             9,
//             9,
//             9
//         ],
//         "weightFlow": [
//             0,
//             0,
//             0,
//             0,
//
//             0,
//             0,
//             0,
//             0,
//             0,
//             0,
//             0
//         ],
//         "temperature": [
//             945,
//             945,
//             945,
//             945,
//             945,
//
//             960,
//             960,
//             960,
//             960,
//             960
//         ],
//         "shotWeight": [
//             0,
//             0,
//             0,
//             0,
//             0,
//             0,
//
//             349,
//             353,
//             353,
//             355,
//             355
//         ],
//         "waterPumped": [
//             0,
//             8,
//             8,
//             28,
//             49,
//             49,
//             72,
//             72,
//             94,
//             116,
//             116,
//             138,
//
//             601,
//             603,
//             603,
//             605,
//             607,
//             607,
//             610,
//             610
//         ],
//         "targetTemperature": [
//             950,
//             950,
//             950,
//             950,
//             950,
//             950,
//
//             950,
//             950
//         ],
//         "targetPumpFlow": [
//             90,
//             90,
//             90,
//             0,
//
//
//             30,
//             30,
//             30,
//
//             30,
//             30,
//             30
//         ],
//         "targetPressure": [
//             40,
//             40,
//             30,
//             30
//         ]
//     },
//     "profile": {
//         "id": 3,
//         "name": "Londinium",
//         "phases": [
//             {
//                 "target": {
//                     "end": 9,
//                     "curve": "INSTANT"
//                 },
//                 "stopConditions": {
//                     "time": 10000,
//                     "pressureAbove": 4,
//                     "waterPumpedInPhase": 65
//                 },
//                 "type": "FLOW",
//                 "skip": false,
//                 "restriction": 4
//             },
//             {
//                 "target": {
//                     "end": 0,
//                     "curve": "INSTANT"
//                 },
//                 "stopConditions": {
//                     "time": 10000,
//                     "pressureBelow": 0.7
//                 },
//                 "type": "FLOW",
//                 "skip": false
//             },
//             {
//                 "target": {
//                     "end": 9,
//                     "curve": "EASE_OUT",
//                     "time": 1000
//                 },
//                 "stopConditions": {
//                     "time": 1000
//                 },
//                 "type": "PRESSURE",
//                 "skip": false
//             },
//             {
//                 "target": {
//                     "end": 9,
//                     "curve": "INSTANT"
//                 },
//                 "stopConditions": {
//                     "time": 4000
//                 },
//                 "type": "PRESSURE",
//                 "skip": false,
//                 "restriction": 3
//             },
//             {
//                 "target": {
//                     "start": 9,
//                     "end": 3,
//                     "curve": "EASE_IN_OUT",
//                     "time": 20000
//                 },
//                 "stopConditions": {},
//                 "type": "PRESSURE",
//                 "skip": false,
//                 "restriction": 3
//             }
//         ],
//         "globalStopConditions": {
//             "weight": 36
//         },
//         "waterTemperature": 95,
//         "recipe": {
//             "coffeeIn": 20,
//             "ratio": 2
//         }
//     }
// }
