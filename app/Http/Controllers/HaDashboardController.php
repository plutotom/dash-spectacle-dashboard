<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class HaDashboardController extends Controller
{
    /**
     * Display the dashboard page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();
            try {
                $calendarEvents = CalendarController::getEvents();
            } catch (\Exception $e) {
                $calendarEvents = [];
                $error = $e->getMessage();
            }
            // Add any dashboard data you need here
            
            $dashboardData = [
                'user' => $user,
                'events' => $calendarEvents,
                'error' => isset($error) ? $error : null,
            ];
            return Inertia::render('HaDashboard/HaDashboard', $dashboardData);

        } catch (\Exception $e) {
            dd($e->getMessage());
            // return Inertia::render('HaDashboard/HaDashboard', [
            //     'error' => 'Failed to load dashboard data',
            //     'message' => $e->getMessage()
            // ]);
        }
    }

    /**
     * Update dashboard preferences
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePreferences(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Validate the request
            $validated = $request->validate([
                'preferences' => 'required|array',
            ]);

            // Update user preferences
            $user->update([
                'dashboard_preferences' => $validated['preferences']
            ]);

            return response()->json([
                'message' => 'Dashboard preferences updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update dashboard preferences',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 