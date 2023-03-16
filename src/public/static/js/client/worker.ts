// Send ready message to client
self.postMessage({ type: 'ready' });

// Listen for messages from client
addEventListener('message', (event) => {
    console.log('Message from client:\n', event);
});
