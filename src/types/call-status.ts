
/**
 * Call status.
 *
 * @export
 * @enum {string}
 */
export enum CallStatus {
    New             = "call.new",
    Standby         = "call.standby",
    Waiting         = "call.waiting",
    ActorEntered    = "actor.entered",
    OnGoing         = "call.ongoing",
    ActorLeft       = "actor.left",
    Finished        = "call.finished"
}