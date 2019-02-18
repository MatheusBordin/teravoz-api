/**
 * Teravoz event model.
 *
 * @class TeravozEvent
 */
class TeravozEvent {

    /**
     *Creates an instance of TeravozEvent.
     * @param {*} type Current status of call.
     * @param {*} callId Call ID.
     * @memberof TeravozEvent
     */
    constructor(type, callId) {
        this.type = type;
        this.call_id = callId;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Call event model.
 *
 * @class CallEvent
 * @extends {TeravozEvent}
 */
class CallEvent extends TeravozEvent {

    /**
     *Creates an instance of CallEvent.
     * @param {*} type Current status of call.
     * @param {*} callNumber Phone number of user.
     * @param {*} callId Call ID.
     * @memberof CallEvent
     */
    constructor(type, callNumber, callId) {
        super(type, callId);
        
        this.direction = "inbound";
        this.our_number = "00000000";
        this.their_number = callNumber;
        this.their_number_type = "mobile";
    }
}

/**
 * Actor event model.
 *
 * @class ActorEvent
 * @extends {TeravozEvent}
 */
class ActorEvent extends TeravozEvent {

    /**
     *Creates an instance of ActorEvent.
     * @param {*} type Current status of call.
     * @param {*} number Number of ramal.
     * @param {*} callId Call ID.
     * @memberof ActorEvent
     */
    constructor(type, number, callId) {
        super(type, callId);

        this.type = type;
        this.number = number;
        this.actor = "teravoz assistant";
    }
}

module.exports = {
    CallEvent,
    ActorEvent
};
