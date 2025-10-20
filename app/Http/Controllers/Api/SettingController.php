<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * Get public settings (cached for 30 seconds).
     */
    public function public()
    {
        $settings = Setting::getPublic();

        return response()->json($settings);
    }
}
