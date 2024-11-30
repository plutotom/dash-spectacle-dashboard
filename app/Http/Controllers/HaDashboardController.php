<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Session;

class HaDashboardController extends Controller
{
    /**
     * Display the dashboard page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $calendarEvents = [];
        $calendarError = null;

        try {
            $calendarEvents = CalendarController::getEvents();
        } catch (Exception $e) {
            $calendarError = $e->getMessage();
            // Log the error
            \Log::error('Dashboard Calendar Error: ' . $e->getMessage());
        }

        // Check if there are any flash messages to pass
        $flashMessages = Session::get('flash', collect())->toArray();

        return Inertia::render('HaDashboard/HaDashboard', [
            'user' => $user,
            'calendar' => [
                'events' => $calendarEvents,
                'error' => $calendarError,
            ],
            'can' => [
                // 'viewCalendar' => Auth::user()->can('viewCalendar'),
            ],
            'flash' => $flashMessages, // Pass the flash messages to the view
        ]);
    }

    public function someAction()
    {
        // Success flash message
        return redirect()
            ->back()
            ->with('success', 'Operation completed successfully');

        // Error flash message
        return redirect()
            ->back()
            ->with('error', 'Something went wrong');
    }

    public function updatePreferences(Request $request)
    {
        try {
            $validated = $request->validate([
                'preferences' => 'required|array',
            ]);

            Auth::user()->update([
                'dashboard_preferences' => $validated['preferences']
            ]);

            return redirect()
                ->back()
                ->with('success', 'Preferences updated successfully');

        } catch (Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update preferences');
        }
    }
} 