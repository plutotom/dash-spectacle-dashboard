<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrayerRequestResource;
use App\Models\PrayerRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PrayerRequestController extends Controller
{
    /**
     * Fetch and cache prayer requests from Notion API.
     */
    public function fetchFromNotion()
    {
        try {
            $cacheKey = 'prayer_requests_notion'.random_int(1, 1000000);
            $notionDbId = config('services.notion.prayer_db_id');
            $notionToken = config('services.notion.api_token');

            if (! $notionDbId || ! $notionToken) {
                throw new \Exception('Missing Notion configuration. Please check your .env file for NOTION_API_TOKEN and NOTION_PRAYER_DB_ID');
            }

            $url = "https://api.notion.com/v1/databases/{$notionDbId}/query";

            $response = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($url, $notionToken) {
                $res = Http::withHeaders([
                    'Authorization' => 'Bearer '.$notionToken,
                    'Notion-Version' => '2022-06-28',
                    'Content-Type' => 'application/json',
                ])->post($url, [
                    'page_size' => 100,
                    'sorts' => [
                        [
                            'property' => 'Prayer Date Created',
                            'direction' => 'descending',
                        ],
                    ],
                ]);

                if (! $res->successful()) {
                    $errorMessage = sprintf(
                        'Notion API error: Status %d - %s',
                        $res->status(),
                        $res->body()
                    );
                    Log::error($errorMessage);
                    throw new \Exception($errorMessage);
                }

                $results = $res->json('results');
                if (empty($results)) {
                    Log::warning('No prayer requests found in Notion database');
                }

                return $results;
            });

            $syncedCount = 0;
            $errorCount = 0;
            $errors = [];

            // Sync to DB
            foreach ($response as $item) {
                try {
                    $props = $item['properties'] ?? [];

                    // Validate required properties
                    if (! isset($props['Name']['title'][0]['plain_text'])) {
                        throw new \Exception('Missing required property: Name');
                    }

                    PrayerRequest::updateOrCreate(
                        ['notion_id' => $item['id']],
                        [
                            'name' => $props['Name']['title'][0]['plain_text'] ?? null,
                            'person' => $props['Person']['rich_text'][0]['plain_text'] ?? null,
                            'is_answered' => $props['IsAnswered']['checkbox'] ?? false,
                            'answer' => $props['Answer']['rich_text'][0]['plain_text'] ?? null,
                            'prayer_date' => $props['Prayer Date']['date']['start'] ?? null,
                        ]
                    );
                    $syncedCount++;
                } catch (\Exception $e) {
                    $errorCount++;
                    $errors[] = sprintf(
                        'Error syncing prayer request %s: %s',
                        $item['id'] ?? 'unknown',
                        $e->getMessage()
                    );
                    Log::error(end($errors));
                }
            }

            $result = [
                'status' => 'completed',
                'total_processed' => count($response),
                'successfully_synced' => $syncedCount,
                'errors' => $errorCount,
                'error_messages' => $errors,
            ];

            if ($errorCount > 0) {
                Log::warning('Prayer request sync completed with errors', $result);
            } else {
                Log::info('Prayer request sync completed successfully', $result);
            }

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Fatal error during prayer request sync: '.$e->getMessage());

            // Return 200 with error info so frontend doesn't break
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 200);
        }
    }

    /**
     * Return all prayer requests (for dashboard).
     */
    public function index()
    {
        $cacheKey = 'prayer_requests_all'.random_int(1, 1000000);
        $requests = Cache::remember($cacheKey, now()->addMinutes(15), function () {
            return PrayerRequest::orderByDesc('prayer_date')->get();
        });

        return PrayerRequestResource::collection($requests);
    }
}
