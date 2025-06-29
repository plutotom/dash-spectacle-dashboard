<?php

namespace Database\Factories;

use App\Models\EspressoShot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EspressoShot>
 */
class EspressoShotFactory extends Factory
{
    protected $model = EspressoShot::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $duration = $this->faker->numberBetween(20, 60); // 20-60 seconds
        $timestamp = $this->faker->dateTimeBetween('-1 month', 'now')->getTimestamp();

        // Generate sample datapoints
        $datapoints = $this->generateSampleDatapoints($duration);

        // Generate sample profile
        $profile = $this->generateSampleProfile();

        return [
            'timestamp' => $timestamp,
            'duration' => $duration,
            'datapoints' => $datapoints,
            'profile' => $profile,
        ];
    }

    /**
     * Generate sample datapoints for testing
     */
    private function generateSampleDatapoints(int $duration): array
    {
        $datapoints = [];
        $timeInShot = [];
        $pressure = [];
        $pumpFlow = [];
        $weightFlow = [];
        $temperature = [];
        $shotWeight = [];
        $waterPumped = [];
        $targetTemperature = [];
        $targetPumpFlow = [];
        $targetPressure = [];

        for ($i = 0; $i <= $duration; $i++) {
            $timeInShot[] = $i;
            $pressure[] = $this->faker->numberBetween(6, 30);
            $pumpFlow[] = $this->faker->numberBetween(0, 90);
            $weightFlow[] = $this->faker->numberBetween(0, 10);
            $temperature[] = $this->faker->numberBetween(940, 960);
            $shotWeight[] = $i > 10 ? $this->faker->numberBetween(0, 400) : 0;
            $waterPumped[] = $this->faker->numberBetween(0, 650);
            $targetTemperature[] = 950;
            $targetPumpFlow[] = $this->faker->numberBetween(0, 90);
            $targetPressure[] = $this->faker->numberBetween(30, 40);
        }

        return [
            'timeInShot' => $timeInShot,
            'pressure' => $pressure,
            'pumpFlow' => $pumpFlow,
            'weightFlow' => $weightFlow,
            'temperature' => $temperature,
            'shotWeight' => $shotWeight,
            'waterPumped' => $waterPumped,
            'targetTemperature' => $targetTemperature,
            'targetPumpFlow' => $targetPumpFlow,
            'targetPressure' => $targetPressure,
        ];
    }

    /**
     * Generate sample profile for testing
     */
    private function generateSampleProfile(): array
    {
        return [
            'id' => $this->faker->numberBetween(1, 10),
            'name' => $this->faker->randomElement(['Londinium', 'Classic', 'Modern', 'Traditional']),
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
            ],
            'globalStopConditions' => [
                'weight' => 36,
            ],
            'waterTemperature' => 95,
            'recipe' => [
                'coffeeIn' => 20,
                'ratio' => 2,
            ],
        ];
    }
}
