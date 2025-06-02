<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotionWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('Received Notion webhook', ['payload' => $request->all()]);
        // Optional: Check for a secret token
        $expectedSecret = config('services.notion.webhook_secret');
        $providedSecret = $request->header('X-Notion-Webhook-Secret');
        if ($expectedSecret && $expectedSecret !== $providedSecret) {
            Log::warning('Notion webhook: invalid secret', ['provided' => $providedSecret]);

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Log the payload for debugging
        Log::info('Received Notion webhook', ['payload' => $request->all()]);

        // Trigger a sync
        $prayerController = new PrayerRequestController;
        $prayerController->fetchFromNotion();

        return response()->json(['status' => 'sync triggered']);
    }
}
