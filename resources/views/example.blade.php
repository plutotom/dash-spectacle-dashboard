<!DOCTYPE html>
<html>
<head>
    <title>Real-time Messages</title>
    @vite(['resources/js/echo.js'])
</head>
<body>
    <div id="messages"></div>
    
    <form id="message-form">
        <input type="text" id="message" name="message">
        <button type="submit">Send</button>
    </form>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const messagesDiv = document.getElementById('messages');
            const messageForm = document.getElementById('message-form');


            // Initialize Laravel Echo
            window.Echo.channel('messages')
                .listen('messageCreated', (e) => {
                    const messageElement = document.createElement('div');
                    console.log(e);
                    messageElement.textContent = e.message;
                    messagesDiv.appendChild(messageElement);
                })
                .subscribed(() => {
                    console.log('✅ Successfully subscribed to messages channel');
                })
               
 window.Echo.channel('messages')
                .listenToAll((e) => {
                    console.log(e);
                })
                .subscribed(() => {
                    console.log('✅ Successfully subscribed to all channel');
                })
               

            // Handle form submission
            messageForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const message = document.getElementById('message').value;
                
                try {
                    await fetch('/send-message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        },
                        body: JSON.stringify({ message })
                    });
                    document.getElementById('message').value = '';
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });
    </script>
</body>
</html>
