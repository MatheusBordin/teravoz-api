const fetch = require('node-fetch');
const { CallEvent } = require('../models/event');

module.exports = {
    // All calls.
    calls: [],
    // Init process.
    init: function(time = 4000) {
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
    // Update call by delegate.
    updateWithDelegate: function(delegate)  {
        const call = this.calls.find(x => x.callId === delegate.call_id);
        call.queue = delegate.destination;

        const event = call.getNextEvent();

        this.send(event);
    },
    // Add new call to stack.
    addCall: function(call) {
        const event = new CallEvent(call.type, call.callNumber, call.callId);
        this.send(event, () => {
            this.calls.push(call);
        });
    },
    // Send event.
    send: function(event, cb = () => null) {
        fetch('http://localhost:4000/api/v1/webhook', { 
            method: 'POST', 
            body: JSON.stringify(event),
            headers: { 'Content-Type': 'application/json' }
        }).then(() => {
            console.log(`Event sended: ${event.call_id} of type ${event.type}`);
            cb();
        }).catch(err => console.log(`Error on send event: ${event.call_id}, err: ${err}`));
    }
};