import { ProgressCircle } from './ProgressCircle';

interface Habit {
    id: string;
    name: string;
    goal: {
        unit_type: string;
        value: number;
        periodicity: string;
    };
}

interface HabitProgress {
    habit: Habit;
    status: string;
    progress: {
        current_value: number;
        target_value: number;
    } | null;
}

interface Props {
    habits: Habit[];
    progress: Record<string, HabitProgress>;
}

export default function TodayProgress({ habits, progress }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Today&apos;s Progress</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {habits.map((habit) => {
                    const habitProgress = progress[habit.id];
                    return (
                        <div key={habit.id} className="rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-2 font-medium">{habit.name}</h3>
                            <div className="flex items-center gap-4">
                                <ProgressCircle
                                    progress={habitProgress.progress ? (habitProgress.progress.current_value / habitProgress.progress.target_value) * 100 : 0}
                                    status={habitProgress.status}
                                />
                                <div className="flex flex-col">
                                    <span className="text-lg">
                                        {habitProgress.progress
                                            ? `${habitProgress.progress.current_value} / ${habitProgress.progress.target_value} ${habit.goal.unit_type}`
                                            : 'Not started'}
                                    </span>
                                    <span className="text-sm text-gray-500">Status: {habitProgress.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
