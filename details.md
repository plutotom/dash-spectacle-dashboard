Dash Spectacle Dashboard - Application Requirements
Purpose: This document provides a comprehensive specification for rebuilding this Home Automation Dashboard application in any tech stack. The app is a personal/family dashboard designed for display on a tablet or wall-mounted screen, integrating weather, calendar, messages, and prayer request tracking.

Overview
Application Type: Home Automation Dashboard (designed for always-on display)

Current Tech Stack:

Backend: Laravel (PHP)
Frontend: React with TypeScript (via Inertia.js)
Styling: Tailwind CSS with dark theme optimizations
Database: Relational (MySQL/PostgreSQL)
Primary Use Case: Wall-mounted display showing:

Current time and date
Weather (current + forecast)
Google Calendar events
Custom family messages
Prayer request tracking (optional, configurable)
Data Models
1. User
User
├── id: integer (primary key)
├── name: string
├── first_name: string (nullable)
├── last_name: string (nullable)
├── email: string (unique)
├── password: string (hashed)
├── google_refresh_token: string (nullable) - for Google Calendar OAuth
├── role: string (e.g., "admin", "user")
├── email_verified_at: datetime (nullable)
├── remember_token: string (nullable)
├── created_at: timestamp
└── updated_at: timestamp
Relationships:
└── hasMany: Messages
2. Message
Message
├── id: integer (primary key)
├── user_id: integer (foreign key → User)
├── name: string - display name for the message author
├── content: text - message body
├── created_at: timestamp
└── updated_at: timestamp
Relationships:
└── belongsTo: User
3. PrayerRequest
PrayerRequest
├── id: integer (primary key)
├── notion_id: string (nullable) - external sync ID (legacy/optional)
├── prayer_request_from: string (nullable) - who submitted the request
├── prayer_for: string (nullable) - who/what the prayer is for
├── prayer_request: text (nullable) - details of the request
├── is_answered: boolean (default: false)
├── answered_at: datetime (nullable)
├── created_at: timestamp
└── updated_at: timestamp
4. Setting
Setting
├── id: integer (primary key)
├── key: string (unique) - setting identifier
├── value: JSON - setting value (can be any type)
├── created_at: timestamp
└── updated_at: timestamp
Key Settings:
└── "show_prayer_requests": boolean - toggles prayer requests on dashboard
Frontend Pages & Components
Main Dashboard Page (HaDashboard)
Purpose: Full-screen, always-on display view optimized for tablets/wall-mounted screens.

Layout Structure:

┌──────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────┐              ┌───────────────┐  │
│  │ TIME (large)            │              │ Current       │  │
│  │ 10:30                   │              │ Weather       │  │
│  │ Wednesday               │              │ 72°           │  │
│  │ January 23, 2026        │              │               │  │
│  └─────────────────────────┘              └───────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 5-Day Weather Forecast (horizontal scroll)               ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │ Custom Messages     │  │ Prayer Requests     │            │
│  │ (scrollable list)   │  │ (scrollable list)   │            │
│  │ + message composer  │  │ limit: 8 items      │            │
│  └─────────────────────┘  └─────────────────────┘            │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Calendar (4-day view)                                    ││
│  │ Today | Tomorrow | Day 3 | Day 4                         ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
Visual Design:

Dark theme background
Glassmorphism effect (semi-transparent white with backdrop blur)
Large typography for time display (8xl for time, 3xl for weekday)
Subtle gradient overlay on background
Responsive layout using CSS flexbox
Component Specifications
1. DateTime Display
Features:
├── Real-time clock (updates every minute)
├── 12-hour format without AM/PM
├── Full weekday name (e.g., "Wednesday")
├── Full date format (e.g., "January 23, 2026")
Styling:
├── Time: Very large (8xl / ~96px)
├── Weekday: Large (3xl / ~30px)
├── Date: Medium (lg / ~18px)
└── Color: Light text on dark background
2. Current Weather Widget
Features:
├── Current temperature (from Home Assistant preferred)
├── Fallback to weather API temperature
├── Auto-refresh every 15 minutes
├── Last updated timestamp
├── WiFi icon indicating live data source
Data Sources:
├── Primary: Home Assistant integration (home_assistant_current_temp)
├── Secondary: Weather API (temp_f)
Styling:
├── Glassmorphism card (bg-white/10 with backdrop-blur)
├── Temperature: 5xl (~48px)
├── Fixed height: 160px
3. Weather Forecast
Features:
├── 5-day forecast display
├── Horizontal layout
├── Auto-refresh every 15-20 minutes
├── Error boundary with fallback message
Styling:
├── Horizontal flex layout
└── Glassmorphism cards for each day
4. Custom Messages Feed
Features:
├── Real-time message feed
├── Auto-refresh every 1 minute
├── Message composer (visible when user is active)
├── Idle detection (composer hides after 10 seconds of inactivity)
├── Max height: 30vh with hidden scrollbar
├── Shows author name and timestamp
Message Fields:
├── name: Author name
├── content: Message text
├── created_at: Timestamp
Styling:
├── Glassmorphism cards for each message
├── Small text (sm / 14px)
├── Gray author text, white content text
└── Composer fades out when inactive
5. Prayer Requests Widget (Dashboard View)
Features:
├── Display list of prayer requests (limit: 8)
├── Auto-refresh every 1 minute
├── Toggle visibility via settings
├── Shows answered/unanswered status
├── Answered requests: strikethrough + reduced opacity
Display Fields:
├── prayer_request_from: Requester name
├── prayer_for: Subject of prayer
├── prayer_request: Details
├── is_answered: Status indicator (○/●)
├── answered_at: When answered
Styling:
├── Glassmorphism cards
├── Max height: 60vh with hidden scrollbar
├── Answered items: 60% opacity + line-through
6. Calendar Widget
Features:
├── 4-day event display (today + 3 days)
├── Google Calendar integration via OAuth
├── Auto-refresh every 20 minutes
├── Grouped by day
Display:
├── Horizontal layout (4 columns)
├── Each day shows list of events
└── Events grouped by date
Admin/Management Pages
Messages Management Page
Route: /messages
Features:
├── Table view with columns: Name, Content, Date, Actions
├── Inline edit capability
├── Delete with confirmation
├── Content expansion (show more/less for long messages)
├── Pagination support
Actions per row:
├── Edit → inline form
├── Save/Cancel edit
└── Delete with confirmation
Admin-only Create Form:
├── Simple input + Add button
├── Role-based access control (admin only)
Prayer Requests Management Page
Route: /prayer-requests
Features:
├── CRUD operations (Create, Read, Update, Delete)
├── Filter tabs: All | Unanswered | Answered
├── Pagination (15 per page)
├── Modal form for create/edit
├── "Mark as Answered" toggle button
Form Fields:
├── prayer_for: Text input (who is requesting prayer)
├── prayer_request: Textarea (prayer details)
├── is_answered: Checkbox
List Display:
├── Requester name with status icon (🙏 or ✅)
├── "For" field if present
├── Prayer content
├── Answered date if applicable
├── Actions: Edit, Mark Answered/Unmark, Delete
Visual Indicators:
├── Answered: Green border + background tint + strikethrough
└── Unanswered: Gray border + white background
API Endpoints
Public Endpoints
GET  /api/settings/public     → { show_prayer_requests: boolean }
GET  /prayer-requests/dashboard → Paginated list for display
GET  /messages/feed           → Recent messages for display
Authenticated Endpoints
# Messages
GET    /messages              → List all (paginated)
POST   /messages              → Create message
PUT    /messages/{id}         → Update message
DELETE /messages/{id}         → Delete message
# Prayer Requests
GET    /prayer-requests/manage/data → Paginated list with filters
POST   /prayer-requests             → Create prayer request
PUT    /prayer-requests/{id}        → Update prayer request
DELETE /prayer-requests/{id}        → Delete prayer request
POST   /prayer-requests/{id}/mark-answered   → Mark as answered
POST   /prayer-requests/{id}/mark-unanswered → Unmark as answered
External Integrations
# Weather Service
- Weather API (e.g., WeatherAPI.com, OpenWeatherMap)
- Home Assistant API (for indoor temperature)
# Calendar Service
- Google Calendar API (OAuth2)
- Returns grouped events by date
Key Features & Behaviors
1. Error Boundaries
All dashboard widgets wrapped in error boundaries that:

Auto-retry on interval (1-10 seconds depending on component)
Display graceful fallback message
Don't crash the entire dashboard
2. Auto-Refresh Intervals
Component          Refresh Interval
─────────────────────────────────────
DateTime           Every 1 minute
Weather (Current)  Every 15 minutes
Weather (Forecast) Every 20 minutes
Messages           Every 1 minute
Prayer Requests    Every 1 minute
Calendar           Every 20 minutes
Settings           Every 30 seconds (polling)
3. Idle Detection
Tracks user activity (mouse, keyboard, touch, scroll)
Hides interactive elements (message composer) after 10 seconds idle
Shows interactive elements on any activity
4. Settings System
Key-value store with JSON values
Cached for 30 seconds
Public settings exposed via unauthenticated endpoint
Dashboard polls for setting changes
5. Role-Based Access
Role        Permissions
───────────────────────────────────────
admin       Full CRUD on all resources
user        View dashboard, post messages
guest       View dashboard only
Styling Guidelines
Design System
/* Colors */
--background: Dark (near-black)
--foreground: Light gray/white text
--primary: Blue (#3B82F6)
--success: Green (#10B981)
--warning: Yellow (#F59E0B)
--danger: Red (#EF4444)
/* Glassmorphism */
background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(8px)
border-radius: 12px
/* Typography */
Font: System font stack (sans-serif)
Time display: 96px
Headers: 24-30px
Body: 14-16px
Small: 12px
Scrollbar Hiding
/* Firefox */
scrollbar-width: none;
/* IE and Edge */
-ms-overflow-style: none;
/* Chrome, Safari, Opera */
::-webkit-scrollbar {
    display: none;
}
Rebuild Checklist
When rebuilding this app, ensure you implement:

 User authentication with roles (admin/user)
 Real-time clock display
 Weather integration (current + forecast)
 Google Calendar OAuth integration
 Messages feature (view + post)
 Prayer requests tracking with answered/unanswered status
 Settings system for feature toggles
 Error boundaries with auto-retry
 Auto-refresh for all data widgets
 Idle detection for interactive elements
 Dark theme with glassmorphism aesthetics
 Responsive layout for tablet/wall display
 Pagination for list views
 Filter/search capabilities
Document generated from dash-spectacle-dashboard codebase analysis