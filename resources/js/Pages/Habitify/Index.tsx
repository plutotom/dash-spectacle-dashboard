import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { HabitifyHabit, HabitifyWeeklyProgress } from '@/types/habitify';
import WeeklyProgress from './components/WeeklyProgress';

interface Props {
    habits: HabitifyHabit[];
    weeklyProgress: HabitifyWeeklyProgress;
}

export default function Index({ habits, weeklyProgress }: Props) {
    console.log('habits', habits);
    console.log('weekly progress', weeklyProgress);
    return (
        <AuthenticatedLayout>
            <div className="space-y-8 p-6">
                <h1 className="text-2xl font-bold">Habitify Dashboard</h1>
                <WeeklyProgress habits={habits} progress={weeklyProgress} />
            </div>
        </AuthenticatedLayout>
    );
}
