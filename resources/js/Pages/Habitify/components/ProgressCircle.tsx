interface ProgressCircleProps {
    progress: number;
    status: string;
}

export function ProgressCircle({ progress, status }: ProgressCircleProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-500';
            case 'in_progress':
                return 'text-blue-500';
            case 'skipped':
                return 'text-gray-400';
            default:
                return 'text-gray-300';
        }
    };

    return (
        <div className="relative h-12 w-12">
            <svg className="h-full w-full" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-gray-200" strokeWidth="2" />
                {/* Progress circle */}
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    className={getStatusColor(status)}
                    strokeWidth="2"
                    strokeDasharray={`${progress} 100`}
                    transform="rotate(-90 18 18)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium">{Math.round(progress)}%</span>
            </div>
        </div>
    );
}
