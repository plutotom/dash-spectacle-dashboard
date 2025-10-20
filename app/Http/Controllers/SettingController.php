<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class SettingController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the settings page.
     */
    public function index()
    {
        $user = auth()->user();

        // Check if user is admin
        if ($user->role !== 'admin') {
            abort(403, 'You do not have permission to access settings.');
        }

        $settings = [
            'show_prayer_requests' => Setting::get('show_prayer_requests', true),
        ];

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the settings.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        // Check if user is admin
        if ($user->role !== 'admin') {
            abort(403, 'You do not have permission to update settings.');
        }

        $validated = $request->validate([
            'show_prayer_requests' => 'required|boolean',
        ]);

        // Update settings
        Setting::set('show_prayer_requests', $validated['show_prayer_requests']);

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
