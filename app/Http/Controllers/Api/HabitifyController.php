<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class HabitifyController extends Controller
{
    private $apiKey;

    private $baseUrl = 'https://api.habitify.me';

    private $cacheTime = 3600; // 1 hour

    public function __construct()
    {
        $this->apiKey = config('services.habitify.api_key');
    }

    /**
     * Get all habits
     */
    public function index()
    {
        return Cache::remember('habitify_habits', $this->cacheTime, function () {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->get("{$this->baseUrl}/habits");

            return $response->json()['data'] ?? [];
        });
    }

    /**
     * Get weekly progress for all habits
     */
    public function weeklyProgress()
    {
        $cacheKey = 'habitify_weekly_progress_'.now()->startOfWeek()->format('Y-m-d');

        return Cache::remember($cacheKey, $this->cacheTime, function () {
            $habits = $this->index();
            $weeklyProgress = [];
            $startDate = now()->startOfWeek();

            foreach ($habits as $habit) {
                $progress = [];
                for ($i = 0; $i < 7; $i++) {
                    $date = $startDate->copy()->addDays($i);
                    $status = $this->getHabitStatus($habit['id'], $date);
                    $progress[] = [
                        'date' => $date->format('Y-m-d'),
                        'status' => $status['status'],
                        'progress' => $status['progress'] ?? null,
                    ];
                }
                $weeklyProgress[$habit['id']] = $progress;
            }

            return $weeklyProgress;
        });
    }

    /**
     * Get status for a specific habit
     */
    private function getHabitStatus($habitId, $date)
    {
        $cacheKey = "habitify_status_{$habitId}_{$date->format('Y-m-d')}";

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($habitId, $date) {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->get("{$this->baseUrl}/status/{$habitId}", [
                'target_date' => $date->format('Y-m-d'),
            ]);

            return $response->json()['data'] ?? ['status' => 'not_started'];
        });
    }
}
