import GP from "../libs/GP.js";
import { except } from "../libs/helpers.js";
import Binary, { SocketMessage } from "../libs/network/Binary.js";
import FxManager from "../libs/servers/FxManager.js";
import Camera from "../libs/users/Camera.js";
import app from "../services/app.js";
import { FxChangeOptions, FxDataOptions, FxObject, FxOptions, InterfaceEvent, MapDefinition, NewMapFxChangeOptions } from "../types/server";
import { PhysicEvent } from "../types/user.js";
import GameUser from "./GameUser.js";

export default class GameMap {
  readonly fxMemory: FxManager[] = [];

  constructor(readonly id: number, readonly serverId: number, readonly definition: MapDefinition) {}

  get users() {
    return app.users.filter((user) => user.isInMap(this.id, this.serverId));
  }

  get server() {
    return app.servers.find((server) => server.serverId === this.serverId);
  }

  sendAll(binary: SocketMessage, predicate?: (user: GameUser) => boolean) {
    this.users
      .filter((user) => {
        return predicate === undefined || predicate(user);
      })
      .forEach((user) => {
        user.send(binary);
      });
  }

  #getHeader(subType: number) {
    const binary = new SocketMessage(5, subType);
    binary.bitWriteUnsignedInt(GP.BIT_MAP_ID, this.id);
    binary.bitWriteUnsignedInt(GP.BIT_SERVER_ID, this.serverId);
    return binary;
  }

  onLostUser(camera: Camera) {
    const binary = this.#getHeader(2);
    binary.bitWriteUnsignedInt(GP.BIT_USER_PID, camera.playerId);
    binary.bitWriteUnsignedInt(GP.BIT_METHODE_ID, camera.methodeId);
    this.sendAll(binary);
  }

  updatePlayerData(user: GameUser, physicEvent?: PhysicEvent) {
    const binary = this.#getHeader(physicEvent === undefined ? 3 : 4);
    binary.bitWriteUnsignedInt(GP.BIT_USER_PID, user.playerId);
    binary.bitWriteUnsignedInt(32, user.time);
    const walker = user.walker;
    walker.exportStateToMessage(binary);
    if (physicEvent !== undefined) {
      binary.bitWriteUnsignedInt(2, physicEvent.event);
      binary.bitWriteUnsignedInt(24, physicEvent.lastColor);
      binary.bitWriteUnsignedInt(24, physicEvent.newColor);
      binary.bitWriteUnsignedInt(8, physicEvent.eventType);
      binary.bitWriteSignedInt(18, physicEvent.lastSpeedX);
      binary.bitWriteSignedInt(18, physicEvent.lastSpeedY);
    }
    this.sendAll(binary, except(user));
  }

  onMessageMap(event: InterfaceEvent, gender: number, options?: { isHtml?: boolean; isModo?: boolean }) {
    const binary = this.#getHeader(7);
    binary.bitWriteBoolean(options?.isHtml ?? false);
    binary.bitWriteBoolean(options?.isModo ?? false);
    binary.bitWriteUnsignedInt(GP.BIT_USER_PID, event.pid ?? 0);
    binary.bitWriteUnsignedInt(GP.BIT_USER_PID, event.uid ?? 0);
    binary.bitWriteUnsignedInt(3, gender);
    binary.bitWriteString(event.pseudo);
    binary.bitWriteUnsignedInt(GP.BIT_SERVER_ID, event.serverId ?? 0);
    binary.bitWriteString(event.text);
    binary.bitWriteUnsignedInt(3, event.action ?? 0);
    this.sendAll(binary);
  }

  removeMapFxChange(fxId: number, fxSid: number, endCause = 0) {
    return this.writeMapFxChange({ fxId, fxSid, endCause, active: false });
  }

  createMapFxChange({ fxId, fxSid, binData }: NewMapFxChangeOptions) {
    return this.writeMapFxChange({
      fxId,
      fxSid,
      binData,
      active: true,
      endCause: 0,
    });
  }

  removeUserFxChange(user: GameUser, fxId: number, fxSid: number, endCause = 0) {
    return this.writeUserFxChange(user, { fxId, fxSid, endCause, active: false });
  }

  createUserFxChange(user: GameUser, { fxId, fxSid, binData }: NewMapFxChangeOptions) {
    return this.writeUserFxChange(user, {
      fxId,
      fxSid,
      binData,
      active: true,
      endCause: 0,
    });
  }

  writeFxChange(binary: Binary, { active, endCause, fxId, fxSid, binData }: FxChangeOptions) {
    binary.bitWriteBoolean(active);
    if (active) {
      this.server?.lastFxSid.increment();
    } else {
      binary.bitWriteUnsignedInt(2, endCause);
    }
    binary.bitWriteUnsignedInt(GP.BIT_FX_ID, fxId);
    binary.bitWriteUnsignedInt(GP.BIT_FX_SID, fxSid as number);
    binary.bitWriteBinaryData(binData);
  }

  writeMapFxChange(options: FxChangeOptions): [FxManager | undefined, SocketMessage] {
    options.fxSid ??= this.server?.lastFxSid.increment();
    const binary = this.#getHeader(10);
    this.writeFxChange(binary, options);

    if (options.active) {
      const fxManager = new FxManager({
        fxSid: options.fxSid as number,
        fxId: options.fxId,
        binData: options.binData ?? new Binary(),
      });
      return [fxManager, binary];
    }

    return [undefined, binary];
  }

  writeUserFxChange(user: GameUser, options: FxChangeOptions): [FxManager | undefined, SocketMessage] {
    options.fxSid ??= this.server?.lastFxSid.increment();

    const binary = this.#getHeader(6);
    binary.bitWriteUnsignedInt(GP.BIT_USER_PID, user.playerId);
    if (user.mainCamera) {
      binary.bitWriteBoolean(user.mainCamera.ready);
    } else {
      binary.bitWriteBoolean(false);
    }
    this.writeFxChange(binary, options);

    if (options.active) {
      const fxManager = new FxManager({
        fxSid: options.fxSid as number,
        fxId: options.fxId,
        binData: options.binData ?? new Binary(),
      });
      return [fxManager, binary];
    }

    return [undefined, binary];
  }

  createMapFx(obj: FxObject, options: FxOptions = {}): [FxManager | undefined, SocketMessage] {
    const server = this.server;

    if (!server) {
      throw new Error(`Server not found for [mapId=${this.id}, serverId=${this.serverId}]`);
    }

    const fxSid = obj.fxSid ?? server.lastFxSid.value;

    const [fxManager, binary] = this.createMapFxChange({
      fxSid,
      fxId: 5,
      binData: GameMap.writeFxData({
        objectId: obj.objectId,
        fxFileId: obj.fxFileId,
        param: obj.binData,
      }),
    });
    if (fxManager) {
      fxManager.options = options;
    }

    return [fxManager, binary];
  }

  static writeFxData({ fxFileId, objectId, param }: FxDataOptions) {
    const hasData = param !== undefined && param.bitLength !== 0;
    const binary = new Binary();
    binary.bitWriteUnsignedInt(GP.BIT_FX_ID, fxFileId);
    binary.bitWriteUnsignedInt(GP.BIT_FX_SID, objectId);
    binary.bitWriteBoolean(hasData);
    if (hasData) {
      binary.bitWriteBinaryData(param);
    }
    return binary;
  }
}
