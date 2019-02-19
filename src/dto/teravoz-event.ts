import { CallStatus } from "../types/call-status";

/**
 * Teravoz event DTO.
 *
 * @export
 * @interface ITeravozEvent
 */
export interface ITeravozEvent {
    type: CallStatus;
    call_id: string;
    timestamp: string;
    direction?: string;
    their_number?: string;
    their_number_type?: string;
    number?: string;
    actor?: string;
}