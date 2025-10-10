<?php

namespace App\Http\Controllers;

use App\Models\EspressoShot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EspressoShotController extends Controller
{
    /**
     * Get the latest shot number from the espresso machine
     */
    private function getLatestShotNumber()
    {
        // This would be replaced with your actual API call to the espresso machine
        try {
            $response = Http::get('your-espresso-machine-api/latest-shot');
            if (! $response->successful()) {
                Log::warning('Espresso latest-shot request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return 0;
            }

            return (int) ($response->json()['shot_number'] ?? 0);
        } catch (\Throwable $e) {
            Log::error('Espresso latest-shot exception: '.$e->getMessage());

            return 0;
        }
    }

    /**
     * Fetch shot data from the espresso machine
     */
    private function fetchShotData($shotNumber)
    {
        // This would be replaced with your actual API call to the espresso machine
        try {
            $response = Http::get("your-espresso-machine-api/shots/{$shotNumber}");
            if (! $response->successful()) {
                Log::warning('Espresso shot fetch failed', [
                    'shotNumber' => $shotNumber,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return null;
            }

            return $response->json();
        } catch (\Throwable $e) {
            Log::error('Espresso shot fetch exception: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Get all shots from the database
     */
    public function index()
    {
        dd(EspressoShot::orderBy('timestamp', 'desc')->get()->toArray());

        return Inertia::render('shots/index', [
            'shots' => EspressoShot::orderBy('timestamp', 'desc')->get(),
        ]);
    }

    /**
     * Get the latest shot from the database
     */
    public function latest()
    {
        return EspressoShot::latest('shot_number')->first();
    }

    /**
     * Sync new shots from the espresso machine
     */
    public function sync()
    {
        $latestMachineShot = $this->getLatestShotNumber();
        $latestDbShot = EspressoShot::max('shot_number') ?? 0;

        if ($latestMachineShot > $latestDbShot) {
            for ($shotNumber = $latestDbShot + 1; $shotNumber <= $latestMachineShot; $shotNumber++) {
                $shotData = $this->fetchShotData($shotNumber);
                if ($shotData === null) {
                    continue;
                }

                EspressoShot::create([
                    'shot_number' => $shotNumber,
                    'temperature' => $shotData['temperature'],
                    'pressure' => $shotData['pressure'],
                    'duration' => $shotData['duration'],
                    'weight' => $shotData['weight'],
                    'profile_data' => $shotData['profile_data'] ?? null,
                    'started_at' => $shotData['started_at'],
                    'completed_at' => $shotData['completed_at'],
                ]);
            }
        }

        return response()->json(['message' => 'Sync completed']);
    }

    /**
     * Start a new shot
     */
    public function start()
    {
        // This would be replaced with your actual API call to start the shot
        try {
            $response = Http::post('your-espresso-machine-api/start-shot');
            if (! $response->successful()) {
                Log::warning('Espresso start-shot failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Espresso start-shot exception: '.$e->getMessage());
        }

        return response()->json(['message' => 'Shot started']);
    }

    /**
     * Get a specific shot
     */
    public function show(string $id)
    {
        return EspressoShot::findOrFail($id);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
