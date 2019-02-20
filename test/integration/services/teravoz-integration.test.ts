process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import { teravozIntegrationService } from "../../../src/services/teravoz-integration";
import { ITeravozEvent } from "../../../src/dto/teravoz-event";
import { CallStatus } from "../../../src/types/call-status";
import { emitterService } from "../../../src/services/emitter";
import { EventType } from "../../../src/types/event-types";
import config from "../../../src/config";
import { callRepository } from "../../../src/repositories/call";
import { userRepository } from "../../../src/repositories/user";

beforeAll(async () => {
    await mongoose.connect(config.mongoURI, { useNewUrlParser: true });
})

beforeEach(async () => {
    await callRepository.deleteMany({});
    await userRepository.deleteMany({});
    emitterService.removeAllListeners();
});

afterAll(async () => {
    await mongoose.disconnect();
});

test("should emit call-init event", async () => {
    const event: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const onCallInit = jest.fn();

    emitterService.on(EventType.CallInit, onCallInit);
    await teravozIntegrationService.processEvent(event);

    expect(onCallInit).toBeCalledWith(
        expect.objectContaining({
            _id: expect.anything()
        })
    );
});

test("should emit call-update event", async () => {
    // Create events.
    const initEvent: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const updateEvent: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.OnGoing,
        their_number: "000-000"
    };

    const updateCall = jest.fn();
    emitterService.on(EventType.CallUpdated, updateCall);

    await teravozIntegrationService.processEvent(initEvent);
    await teravozIntegrationService.processEvent(updateEvent);

    expect(updateCall).toBeCalledWith(
        expect.objectContaining({
            _id: expect.anything()
        })
    );
});

test("should emit call-finished event", async () => {
    // Create events.
    const initEvent: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const updateEvent: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.Finished,
        their_number: "000-000"
    };

    const endCall = jest.fn();
    emitterService.on(EventType.CallEnd, endCall);

    await teravozIntegrationService.processEvent(initEvent);
    await teravozIntegrationService.processEvent(updateEvent);

    expect(endCall).toBeCalledWith(
        expect.objectContaining({
            _id: expect.anything()
        })
    );
});

test("should update call status", async () => {
    // Create events.
    const initEvent: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const ongoingEvent: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.OnGoing,
        their_number: "000-000"
    };

    await teravozIntegrationService.processEvent(initEvent);
    await teravozIntegrationService.processEvent(ongoingEvent);

    const call = await callRepository.findOne({ teravozId: "001" }).exec();
    expect(call.status).toBe(CallStatus.OnGoing);
});

test("should update receptionist", async () => {
    // Create events.
    const initEvent: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const actorEvent: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.ActorEntered,
        their_number: "000-000",
        actor: "Matheus",
        number: "*2901"
    };

    await teravozIntegrationService.processEvent(initEvent);
    await teravozIntegrationService.processEvent(actorEvent);

    const call = await callRepository.findOne({ teravozId: "001" }).exec();
    expect(call.receptionist).toBe("Matheus");
    expect(call.receptionistNumber).toBe("*2901");
});

test("should dispatch queue on standby event", async () => {
    // Insert call.
    const call = new callRepository({
        teravozId: "001",
        status: CallStatus.New,
        queue: "900",
        userId: null,
        userNumber: "000-000"
    });

    await call.save();

    // Create event
    const event: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.Standby,
        their_number: "000-000"
    };

    const dispatchQueue = jest.fn();
    teravozIntegrationService.dispatchQueue = dispatchQueue;
    await teravozIntegrationService.processEvent(event);

    expect(dispatchQueue).toBeCalled();
});

test("should delegate queue 900", async () => {
    // Create events.
    const initEvent: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const standbyEvent: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.Standby,
        their_number: "000-000"
    };

    const dispatchQueue = jest.fn();
    teravozIntegrationService.dispatchQueue = dispatchQueue;
    await teravozIntegrationService.processEvent(initEvent);
    await teravozIntegrationService.processEvent(standbyEvent);

    expect(dispatchQueue).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            queue: "900"
        })
    );
});

test("should delegate queue 901", async () => {
    // Create user
    await new userRepository({
        name: "Matheus",
        email: "teste@teravoz.com.br",
        callNumber: "000-000"
    }).save();


    // Create events.
    const initEvent: ITeravozEvent = {
        call_id: "001",
        timestamp: new Date().toISOString(),
        type: CallStatus.New,
        their_number: "000-000"
    };

    const standbyEvent: ITeravozEvent = {
        call_id: "001", // Must be equal call.teravozId
        timestamp: new Date().toISOString(),
        type: CallStatus.Standby,
        their_number: "000-000"
    };

    const dispatchQueue = jest.fn();
    teravozIntegrationService.dispatchQueue = dispatchQueue;
    await teravozIntegrationService.processEvent(initEvent);
    await teravozIntegrationService.processEvent(standbyEvent);

    expect(dispatchQueue).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            queue: "901"
        })
    );
});