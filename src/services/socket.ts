import { Server, Socket } from "socket.io";
import { EventType } from "../types/event-types";
import { ICallEntity } from "../entities/call";
import { emitterService } from "./emitter";
import { callRepository } from "../repositories/call";

/**
 * Real-time service.
 *
 * @export
 * @class SocketService
 */
export class SocketService {
  /**
   * Start socket service.
   *
   * @static
   * @param {Server} io Socket.io server.
   * @returns New service instance.
   * @memberof SocketService
   */
  public static start(io: Server) {
      const service = new SocketService(io);
      return service;
  }

  constructor(private readonly io: Server) {
    this.listenEvents();
  }

  /**
   * Listen all events.
   *
   * @memberof SocketService
   */
  public listenEvents() {
    // Connection events
    this.io.on("connection", (socket) => {
        this.onConnect(socket);
        socket.on("disconnect", this.onDisconnect.bind(this));
    });

    // Data updated events.
    emitterService.on(EventType.CallInit, this.onCallInit.bind(this));
    emitterService.on(EventType.CallUpdated, this.onCallUpdate.bind(this));
    emitterService.on(EventType.CallEnd, this.onCallEnd.bind(this));
  }

  /**
   * On connect event.
   *
   * @param {Socket} socket Socket instance.
   * @memberof SocketService
   */
  public onConnect(socket: Socket) {
    console.log('User connected');
    
    callRepository.find({}).then(data => {
      socket.emit(EventType.ListCalls, data);
    });
  }

  /**
   * On disconnect event.
   *
   * @memberof SocketService
   */
  public onDisconnect() {
    console.log('User disconnected');
  }

  /**
   * On call finished.
   *
   * @param {ICallEntity} call Call.
   * @memberof SocketService
   */
  public onCallEnd(call: ICallEntity) {
    this.io.emit(EventType.CallEnd, call);
  }

  /**
   * On call init.
   *
   * @param {ICallEntity} call Call.
   * @memberof SocketService
   */
  public onCallInit(call: ICallEntity) {
    this.io.emit(EventType.CallInit, call);
  }

  /**
   * On call update.
   *
   * @param {ICallEntity} call Call.
   * @memberof SocketService
   */
  public onCallUpdate(call: ICallEntity) {
    this.io.emit(EventType.CallUpdated, call);
  }
}
