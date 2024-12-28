import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: 'mt1',
});

// Single event listener setup
document.addEventListener('DOMContentLoaded', function () {
    console.log('Echo setup initialized');
    
    // Listen for messages
    window.Echo.channel('messages')
        .listen('.MessageCreated', (e) => {
            console.log('Message received:', e);
        });

    // Listen for orders
    window.Echo.channel('orders')
        .listen('.OrderCreated', (e) => {
            console.log('Order received:', e);
        });
});




console.log(window.Echo);
console.log("here is echo");


window.Echo.channel(`messages`)
    .listen('MessageCreated', (e) => {
        console.log(e.message);
    });


window.Echo.channel(`orders`)
    .listen('OrderCreated', (e) => {
        console.log(e.order);
    });
window.Echo.channel(`orders`)
    .listen('order.created', (e) => {
        console.log(e.order);
    });
window.Echo.channel(`orders`)
    .listen('.order.created', (e) => {
        console.log(e.order);
    });

    window.Echo.private(`orders`)
        .listen('.order.created', (response) => {
            console.log("Event received:", response);
        });


