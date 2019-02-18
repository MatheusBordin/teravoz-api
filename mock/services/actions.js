const fetch = require('node-fetch');

module.exports = {
    // All calls.
    calls: [],
    // Init process.
    init: function(time = 2000) {
        setInterval(() => this.process(), time);
    },
    // Process calls in stack.
    process: function() {
        const removedCallQueue = [];
        const readyCalls = this.calls.filter(x => x.type !== 'call.standby');

        // Dispatch events to webhook endpoint.
        for (const call of readyCalls) {
            const event = call.getNextEvent();

            if (event) {
                return this.send(event);
            }

            removedCallQueue.push(call);
        }

        // Remove finished calls of stack.
        while (removedCallQueue.length > 0) {
            const call = removedCallQueue.pop();
            const idx = this.calls.findIndex(x => x.callId === call.callId);

            this.calls.splice(idx, 1);
        }
    },
    // Send event.
    send: function(event) {
        fetch('http://localhost:4000/api/v1/webhook', { method: 'POST', body: event })
            .then(res => res.json())
            .then(res => console.log(`Event sended: ${event.callId} of type ${event.type}`))
            .catch(err => console.log(`Error on send event: ${event.callId}, err: ${err}`));
    }
};