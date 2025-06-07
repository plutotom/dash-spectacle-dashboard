<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class HabitifyController extends Controller
{
    private $apiKey;

    private $baseUrl = 'https://api.habitify.me';

    private $cacheTime = 3600; // 1 hour in seconds

    private $habitsCacheTime = 86400; // 24 hours for habits list

    public function __construct()
    {
        $this->apiKey = config('services.habitify.api_key');
    }

    public function index()
    {
        $habits = $this->getHabitsFromHabitify();
        $this->clearCache();
        $weeklyProgress = $this->getWeeklyProgress($habits);

        return Inertia::render('Habitify/Index', [
            'habits' => $habits,
            'weeklyProgress' => $weeklyProgress,
        ]);
    }

    private function getHabitsFromHabitify()
    {
        // Cache habits for 24 hours since they don't change often
        return Cache::remember('habitify_habits', $this->habitsCacheTime, function () {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->get("{$this->baseUrl}/habits");

            return $response->json()['data'] ?? [];
        });
    }

    private function getWeeklyProgress($habits)
    {
        $cacheKey = 'habitify_weekly_progress_'.now()->startOfWeek()->format('Y-m-d');

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($habits) {
            $weeklyProgress = [];
            $startDate = now()->startOfWeek();

            foreach ($habits as $habit) {
                $progress = [];
                for ($i = 0; $i < 7; $i++) {
                    $date = $startDate->copy()->addDays($i);
                    $status = $this->getHabitStatus($habit['id'], $date);
                    $name = $habit['name'];
                    $goal = $habit['goal'];
                    $progress[] = [
                        'date' => $date->format('Y-m-d'),
                        'status' => $status['status'],
                        'progress' => $status['progress'] ?? null,
                        'name' => $name,
                        'goal' => $goal,
                    ];
                }
                $weeklyProgress[$habit['id']] = $progress;
            }

            return $weeklyProgress;
        });
    }

    private function getHabitStatus($habitId, $date)
    {
        $cacheKey = "habitify_status_{$habitId}_{$date->format('Y-m-d')}";

        return Cache::remember($cacheKey, $this->cacheTime, function () use ($habitId, $date) {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->get("{$this->baseUrl}/status/{$habitId}", [
                'target_date' => $date->format('Y-m-d\TH:i:sP'),
            ]);

            $data = $response->json()['data'] ?? ['status' => 'none'];

            // Ensure we have a consistent response structure
            return [
                'status' => $data['status'] ?? 'none',
                'progress' => $data['progress'] ?? null,
            ];
        });
    }

    // Helper method to clear all Habitify related caches
    public function clearCache()
    {
        Cache::forget('habitify_habits');
        Cache::forget('habitify_weekly_progress_'.now()->startOfWeek()->format('Y-m-d'));

        // Clear all status caches for the current week
        $habits = $this->getHabitsFromHabitify();
        $startDate = now()->startOfWeek();

        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            foreach ($habits as $habit) {
                Cache::forget("habitify_status_{$habit['id']}_{$date->format('Y-m-d')}");
            }
        }
    }
}
