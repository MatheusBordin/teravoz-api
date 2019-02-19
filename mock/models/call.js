const uuidv1 = require('uuid/v1');
const { CallEvent, ActorEvent } = require('./event');

/**
 * Call model.
 *
 * @class Call
 */
class Call {

    /**
     *Creates an instance of Call.
     * @param {*} type Current status of call
     * @param {*} number Number of ramal
     * @param {*} callNumber Call number of user
     * @memberof Call
     */
    constructor(type, queue, number, callNumber) {
        this.type = type;
        this.queue = queue;
        this.number = number;
        this.callNumber = callNumber;
        this.callId = uuidv1();
    }

    /**
     * Update call and return new Event.
     *
     * @returns
     * @memberof Call
     */
    getNextEvent() {
        if (this.type === 'call.new') {
            this.type = 'call.standby';
            return new CallEvent(this.type, this.callNumber, this.callId);
        } else if (this.type === 'call.standby') {
            this.type = 'call.waiting';
            return new CallEvent(this.type, this.callNumber, this.callId);
        } else if (this.type === 'call.waiting') {
            this.type = 'actor.entered';
            
            if (this.queue === '900') {
                this.number = '*2900';
            } else if (this.queue === '901') {
                this.number = '*2901';
            }

            return new ActorEvent(this.type, this.number, this.callId);
        } else if (this.type === 'actor.entered') {
            this.type = 'call.ongoing';
            return new CallEvent(this.type, this.callNumber, this.callId);
        } else if (this.type === 'call.ongoing') {
            this.type = 'actor.left';
            return new ActorEvent(this.type, this.number, this.callId);
        } else if (this.type === 'actor.left') {
            this.type = 'call.finished';
            return new CallEvent(this.type, this.callNumber, this.callId);
        } else if (this.type === 'call.finished') {
            return null;
        }
    }
}

module.exports = Call;