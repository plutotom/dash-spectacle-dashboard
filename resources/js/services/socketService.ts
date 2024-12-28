import Echo from 'laravel-echo';

declare global {
    interface Window {
        // @ts-expect-error Echo is not typed
        Echo: Echo;
    }
}

export function createSocketConnection() {
    if (!window.Echo) {
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: 'local',
            wsHost: '127.0.0.1',
            wsPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            disableStats: true,
        });
    }
}
