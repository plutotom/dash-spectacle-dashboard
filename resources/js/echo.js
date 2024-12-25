import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'randomekey',
    cluster: 'mt1',
    wsHost: '127.0.0.1',
    wsPort: 6001,
    wssPort: 6002,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});


// // Add these debug listeners
// window.Echo.connector.pusher.connection.bind('connected', () => {
//     console.log('Pusher Connected! 🎉');
// });

// window.Echo.connector.pusher.connection.bind('error', (err) => {
//     console.log('Pusher Error 😢', err);
// });

// window.Echo.connector.pusher.connection.bind('disconnected', () => {
//     console.log('Pusher Disconnected! ⚡');
// });

// // Test subscription
// window.Echo.private('test-channel')
//     .listen('TestEvent', (e) => {
//         console.log('Received test event:', e);
//     })
//     .error((error) => {
//         console.error('Error subscribing to channel:', error);
//     });

// console.log("in echo file");
// console.log(window.Echo);