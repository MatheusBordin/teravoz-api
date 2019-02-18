/**
 * Delegate data transfer object.
 *
 * @export
 * @class Delegate
 */
export class Delegate {

    constructor(
        public call_id: string,
        public destination: string,
        public type = "delegate"
    ) {}
}
