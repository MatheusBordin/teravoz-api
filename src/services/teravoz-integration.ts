import fetch from "node-fetch";
import { ITeravozEvent } from "../dto/teravoz-event";
import { CallStatus } from "../types/call-status";
import { emitterService } from "./emitter";
import { EventType } from "../types/event-types";
import { Delegate } from "../dto/delegate";
import { ICallEntity } from "../entities/call";
import config from "../config";
import { callRepository } from "../repositories/call";
import { userRepository } from "../repositories/user";

/**
 * Teravoz integration service.
 *
 * @export
 * @class TeravozIntegrationService
 */
export class TeravozIntegrationService {

    /**
     * Process received event.
     *
     * @param {ITeravozEvent} event Received event.
     * @returns
     * @memberof TeravozIntegrationService
     */
    public async processEvent(event: ITeravozEvent) {
        if (event.type === CallStatus.New) {
            const call = await this.createCall(event);
            return emitterService.emit(EventType.CallInit, call);
        }

        const updatedCall = await this.updateCall(event);

        if (event.type === CallStatus.Standby) {
            this.dispatchQueue(event, updatedCall);
        }
    }

    /**
     * Create new call by event.
     *
     * @param {ITeravozEvent} event Received event.
     * @returns
     * @memberof TeravozIntegrationService
     */
    public async createCall(event: ITeravozEvent) {
        const user = await userRepository.findOne({ callNumber: event.their_number }).exec();
        const call = new callRepository(<ICallEntity> {
            status: event.type,
            queue: !!user ? "200" : "201",
            teravozId: event.call_id,
            userId: !!user ? user._id : null,
            userNumber: event.their_number
        });

        return await call.save();
    }

    /**
     * Update call by event.
     *
     * @param {ITeravozEvent} event Received event.
     * @returns
     * @memberof TeravozIntegrationService
     */
    public async updateCall(event: ITeravozEvent) {
        const call = await callRepository.findOne({ teravozId: event.call_id }).exec();

        call.status = event.type;
        if (event.type === CallStatus.ActorEntered) {
            call.receptionist = event.actor;
            call.receptionistNumber = event.number;
        }

        const result = await call.save();

        if (event.type === CallStatus.Finished) {
            emitterService.emit(EventType.CallEnd, result);
        } else {
            emitterService.emit(EventType.CallUpdated, result);
        }

        return result;
    }

    /**
     * Dispatch event to TeravozAPI.
     *
     * @param {ITeravozEvent} event Received event.
     * @param {ICallEntity} call Call entity.
     * @memberof TeravozIntegrationService
     */
    public async dispatchQueue(event: ITeravozEvent, call: ICallEntity) {
        const delegate = new Delegate(event.call_id, call.queue);

        await fetch(`${config.teravozURI}/actions`, { 
            method: "POST", 
            body: JSON.stringify(delegate),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Export service instance.
export const teravozIntegrationService = new TeravozIntegrationService();