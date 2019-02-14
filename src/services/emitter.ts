import { EventEmitter } from "events";

/**
 * Event emitter service.
 *
 * @class EmitterService
 * @extends {EventEmitter}
 */
class EmitterService extends EventEmitter {}

export const emitterService = new EmitterService();