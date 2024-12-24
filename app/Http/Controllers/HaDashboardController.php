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
        return Inertia::render('HaDashboard/HaDashboard', [
        ]);
    }
    
    // TODO: add preferences update to manage Dashboard settings
    // public function updatePreferences(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'preferences' => 'required|array',
    //         ]);

    //         Auth::user()->update([
    //             'dashboard_preferences' => $validated['preferences']
    //         ]);

    //         return redirect()
    //             ->back()
    //             ->with('success', 'Preferences updated successfully');

    //     } catch (Exception $e) {
    //         return redirect()
    //             ->back()
    //             ->with('error', 'Failed to update preferences');
    //     }
    // }
} 