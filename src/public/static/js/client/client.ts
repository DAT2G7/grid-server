console.log('Client running');

if (window.Worker) {
    console.log('Web worker supported');

    // Create web worker. This way is not ideal, but allows for a simpler build process.
    const worker = new Worker('/static/js/client/worker.js');

    // The ideal would be to use this, but it requires a more complex build process.
    // const worker = new Worker(new URL("./worker.ts", import.meta.url));

    // Listen for messages from worker
    worker.addEventListener('message', (event) => {
        console.log('Message from worker:\n', event);

        // Send message to worker
        worker.postMessage({ type: 'message', data: 'Hello worker!' });
    });
} else {
    console.log('Web worker not supported');
}
