import { WeeklyProgressProps } from '@/types/habitify';

function getBoxColor(status: string) {
    switch (status) {
        case 'completed':
            return 'bg-green-500';
        case 'failed':
            return 'bg-red-400';
        case 'skipped':
            return 'bg-gray-300';
        case 'in_progress':
            return 'bg-yellow-300';
        case 'none':
        default:
            return 'bg-gray-100';
    }
}

function getAriaLabel(status: string, percent: number, date: string) {
    if (status === 'completed') return `${date}: completed`;
    if (status === 'failed') return `${date}: failed`;
    if (status === 'skipped') return `${date}: skipped`;
    if (status === 'in_progress') return `${date}: in progress, ${Math.round(percent)}%`;
    return `${date}: not started`;
}

function getTitle(status: string, percent: number, date: string) {
    if (status === 'completed') return `${date}: Completed`;
    if (status === 'failed') return `${date}: Failed`;
    if (status === 'skipped') return `${date}: Skipped`;
    if (status === 'in_progress') return `${date}: In progress (${Math.round(percent)}%)`;
    return `${date}: Not started`;
}

export default function WeeklyProgress({ habits, progress }: WeeklyProgressProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Weekly Progress</h2>
            <div className="grid grid-cols-1 gap-6">
                {habits.map((habit) => {
                    const weeklyData = progress[habit.id];
                    return (
                        <div key={habit.id} className="rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-4 font-medium">{habit.name}</h3>
                            <div className="grid grid-cols-7 gap-2">
                                {weeklyData.map((day, index) => {
                                    const percent =
                                        day.progress && day.progress.target_value > 0 ? (day.progress.current_value / day.progress.target_value) * 100 : 0;
                                    const color = getBoxColor(day.status);
                                    const date = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
                                    return (
                                        <div key={index} className="flex flex-col items-center">
                                            <div
                                                aria-label={getAriaLabel(day.status, percent, date)}
                                                title={getTitle(day.status, percent, date)}
                                                className={`h-7 w-7 rounded border border-gray-200 ${color} transition-transform duration-150 hover:scale-110 hover:shadow-md`}
                                            />
                                            <span className="mt-1 select-none text-[10px] text-gray-400">
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
