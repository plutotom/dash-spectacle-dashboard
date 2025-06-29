<?php

namespace Database\Seeders;

use App\Models\EspressoShot;
use Illuminate\Database\Seeder;

class EspressoShotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 sample espresso shots
        EspressoShot::factory(50)->create();

        // Create a specific sample shot with realistic data
        EspressoShot::create([
            'timestamp' => time(),
            'duration' => 383,
            'datapoints' => [
                'timeInShot' => range(1, 383),
                'pressure' => array_merge(
                    array_fill(0, 7, 6),
                    array_fill(0, 2, 7),
                    array_fill(0, 2, 8),
                    array_fill(0, 2, 10),
                    array_fill(0, 370, 30)
                ),
                'pumpFlow' => array_merge(
                    [0],
                    array_fill(0, 2, 31),
                    [80],
                    array_fill(0, 379, 9)
                ),
                'weightFlow' => array_fill(0, 383, 0),
                'temperature' => array_merge(
                    array_fill(0, 5, 945),
                    array_fill(0, 378, 960)
                ),
                'shotWeight' => array_merge(
                    array_fill(0, 6, 0),
                    array_fill(0, 377, 355)
                ),
                'waterPumped' => array_merge(
                    [0, 8, 8, 28, 49, 49, 72, 72, 94, 116, 116, 138],
                    array_fill(0, 371, 610)
                ),
                'targetTemperature' => array_fill(0, 383, 950),
                'targetPumpFlow' => array_merge(
                    array_fill(0, 3, 90),
                    [0],
                    array_fill(0, 379, 30)
                ),
                'targetPressure' => array_merge(
                    array_fill(0, 2, 40),
                    array_fill(0, 381, 30)
                ),
            ],
            'profile' => [
                'id' => 3,
                'name' => 'Londinium',
                'phases' => [
                    [
                        'target' => [
                            'end' => 9,
                            'curve' => 'INSTANT',
                            'time' => 0,
                        ],
                        'stopConditions' => [
                            'time' => 10000,
                            'pressureAbove' => 4,
                            'waterPumpedInPhase' => 65,
                        ],
                        'type' => 'FLOW',
                        'skip' => false,
                        'restriction' => 4,
                    ],
                    [
                        'target' => [
                            'end' => 0,
                            'curve' => 'INSTANT',
                            'time' => 0,
                        ],
                        'stopConditions' => [
                            'time' => 10000,
                            'pressureBelow' => 0.7,
                        ],
                        'type' => 'FLOW',
                        'skip' => false,
                    ],
                    [
                        'target' => [
                            'end' => 9,
                            'curve' => 'EASE_OUT',
                            'time' => 1000,
                        ],
                        'stopConditions' => [
                            'time' => 1000,
                        ],
                        'type' => 'PRESSURE',
                        'skip' => false,
                    ],
                    [
                        'target' => [
                            'end' => 9,
                            'curve' => 'INSTANT',
                            'time' => 0,
                        ],
                        'stopConditions' => [
                            'time' => 4000,
                        ],
                        'type' => 'PRESSURE',
                        'skip' => false,
                        'restriction' => 3,
                    ],
                    [
                        'target' => [
                            'start' => 9,
                            'end' => 3,
                            'curve' => 'EASE_IN_OUT',
                            'time' => 20000,
                        ],
                        'stopConditions' => [],
                        'type' => 'PRESSURE',
                        'skip' => false,
                        'restriction' => 3,
                    ],
                ],
                'globalStopConditions' => [
                    'weight' => 36,
                ],
                'waterTemperature' => 95,
                'recipe' => [
                    'coffeeIn' => 20,
                    'ratio' => 2,
                ],
            ],
        ]);
    }
}
