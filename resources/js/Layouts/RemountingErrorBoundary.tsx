import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function RemountingErrorBoundary({ children, intervalMs }) {
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        if (resetKey === 0) return;
        const timer = setTimeout(() => setResetKey((k) => k + 1), intervalMs);
        return () => clearTimeout(timer);
    }, [resetKey, intervalMs]);

    return (
        <ErrorBoundary
            fallbackRender={() => <div>Something went wrong. Retrying in {intervalMs / 60000} minutes...</div>}
            onReset={() => setResetKey((k) => k + 1)}
            resetKeys={[resetKey]}
        >
            {children}
        </ErrorBoundary>
    );
}
