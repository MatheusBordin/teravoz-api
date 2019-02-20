process.env.NODE_ENV = "test";
import * as req from "supertest";
import * as http from "http";
import * as socketio from "socket.io";
import * as socketClient from "socket.io-client";
import app from "../../../src/app";
import { SocketService } from "../../../src/services/socket";
import config from "../../../src/config";
import { EventType } from "../../../src/types/event-types";
import { emitterService } from "../../../src/services/emitter";

// Create server
const server = http.createServer(app);
const io = socketio(server);
server.listen(config.port);

beforeEach(() => {
  emitterService.removeAllListeners();
});

test("should receive user connect event", async () => {
  const instance = SocketService.start(io);
  const mockFn = jest.fn();

  instance.onConnect = mockFn;
  socketClient.connect(`http://localhost:${config.port}`);

  setTimeout(() => {
    expect(mockFn).toBeCalled();
  }, 1000);
});

test("should receive user disconnect event", async () => {
  const instance = SocketService.start(io);
  const mockFn = jest.fn();

  instance.onConnect = jest.fn();
  instance.onDisconnect = mockFn;
  const socket = socketClient.connect(`http://localhost:${config.port}`);
  socket.disconnect();

  setTimeout(() => {
    expect(mockFn).toBeCalled();
  }, 1000);
});

test("should emit call-update", async () => {
  const instance = SocketService.start(io);
  const mockFn = jest.fn();

  instance.onConnect = jest.fn();
  instance.onDisconnect = jest.fn();

  const socket = socketClient.connect(`http://localhost:${config.port}`);
  socket.on(EventType.CallUpdated, mockFn);

  emitterService.emit(EventType.CallUpdated);

  setTimeout(() => {
    expect(mockFn).toBeCalled();
  }, 1000);
});

test("should emit call-init", async () => {
  const instance = SocketService.start(io);
  const mockFn = jest.fn();

  instance.onConnect = jest.fn();
  instance.onDisconnect = jest.fn();

  const socket = socketClient.connect(`http://localhost:${config.port}`);
  socket.on(EventType.CallInit, mockFn);

  emitterService.emit(EventType.CallInit);

  setTimeout(() => {
    expect(mockFn).toBeCalled();
  }, 1000);
});

test("should emit call-end", async () => {
  const instance = SocketService.start(io);
  const mockFn = jest.fn();

  instance.onConnect = jest.fn();
  instance.onDisconnect = jest.fn();

  const socket = socketClient.connect(`http://localhost:${config.port}`);
  socket.on(EventType.CallEnd, mockFn);

  emitterService.emit(EventType.CallEnd);

  setTimeout(() => {
    expect(mockFn).toBeCalled();
  }, 1000);
});