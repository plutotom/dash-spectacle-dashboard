import Echo from 'laravel-echo';
import Pusher from 'pusher-js';  // Add this import

// Add this line before Echo initialization
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'local',
    wsHost: '127.0.0.1',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
});


// window.Echo.channel('messages').listen('PackageSent', (event) => {
//     console.log(event);
// });

// window.Echo.channel('.messages').listen('PackageSent', (event) => {
//     console.log(event);
// });

// window.Echo.channel('.messages').listen('.messages', (data) => {
//     console.log('Received message:', data);
// });

// window.Echo.channel('messages').listen('messages', (data) => {
//     console.log('Received message:', data);
// });

