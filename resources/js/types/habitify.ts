// Base types
export interface HabitifyGoal {
    unit_type: string;
    value: number;
    periodicity: string;
}

export interface HabitifyArea {
    id: string;
    name: string;
    priority: string;
}

export interface HabitifyHabit {
    id: string;
    name: string;
    is_archived: boolean;
    start_date: string;
    time_of_day: string[];
    goal: HabitifyGoal;
    goal_history_items: HabitifyGoal[];
    log_method: string;
    recurrence: string;
    remind: string[];
    area: HabitifyArea | null;
    created_date: string;
    priority: number;
}

// Progress types
export interface HabitifyProgress {
    current_value: number;
    target_value: number;
    unit_type: string;
    periodicity: string;
    reference_date: string;
}

// Status as returned by /status/:habit_id
export type HabitifyStatusType = 'none' | 'in_progress' | 'completed' | 'skipped' | 'failed';

export interface HabitifyStatus {
    status: HabitifyStatusType;
    progress: HabitifyProgress | null;
}

export interface HabitifyDailyProgress {
    date: string;
    status: HabitifyStatus['status'];
    progress: HabitifyProgress | null;
}

// Weekly progress for a single day
export interface HabitifyWeeklyDay {
    date: string;
    status: HabitifyStatusType;
    progress: HabitifyProgress | null;
    name: string;
    goal: HabitifyGoal;
}

// Weekly progress for all habits
export type HabitifyWeeklyProgress = {
    [habitId: string]: HabitifyWeeklyDay[];
};

// API Response types
export interface HabitifyApiResponse<T> {
    message: string;
    data: T;
    version: string;
    status: boolean;
}

// Component Props types
export interface WeeklyProgressProps {
    habits: HabitifyHabit[];
    progress: HabitifyWeeklyProgress;
}

export interface ProgressCircleProps {
    progress: number;
    status: HabitifyStatus['status'];
}
