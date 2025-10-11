import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type RemountingErrorBoundaryProps = {
    children: ReactNode;
    intervalMs?: number;
    fallback?: ReactNode;
};

export default function RemountingErrorBoundary({ children, intervalMs = 60_000, fallback }: RemountingErrorBoundaryProps) {
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        if (resetKey === 0) return;
        const timer = setTimeout(() => setResetKey((k) => k + 1), intervalMs);
        return () => clearTimeout(timer);
    }, [resetKey, intervalMs]);

    return (
        <ErrorBoundary
            fallbackRender={() => fallback ?? <div>Something went wrong. Retrying in {intervalMs / 60000} minutes...</div>}
            onReset={() => setResetKey((k) => k + 1)}
            resetKeys={[resetKey]}
        >
            {children}
        </ErrorBoundary>
    );
}
