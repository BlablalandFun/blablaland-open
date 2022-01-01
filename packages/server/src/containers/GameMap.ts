import GP from "../libs/GP.js";
import { except } from "../libs/helpers.js";
import Binary, { SocketMessage } from "../libs/network/Binary.js";
import app from "../services/app.js";
import { MapDefinition } from "../types/server";
import { PhysicEvent } from "../types/user.js";
import GameUser from "./GameUser.js";

export default class GameMap {

  constructor(
    readonly id: number,
    readonly serverId: number,
    readonly definition: MapDefinition
  ) { }

  get #users() {
    return app.users.filter(user => user.isInMap(this.id, this.serverId))
  }

  sendAll(binary: SocketMessage, predicate?: (user: GameUser) => boolean) {
    for (const user of this.#users) {
      if (predicate === undefined || predicate(user)) {
        user.send(binary)
      }
    }
  }

  #getHeader(subType: number) {
    const binary = new SocketMessage(5, subType)
    binary.bitWriteUnsignedInt(GP.BIT_MAP_ID, this.id)
    binary.bitWriteUnsignedInt(GP.BIT_SERVER_ID, this.serverId)
    return binary
  }

  updatePlayerData(user: GameUser, physicEvent?: PhysicEvent) {
    const binary = this.#getHeader(physicEvent === undefined ? 3 : 4)
    binary.bitWriteUnsignedInt(GP.BIT_USER_PID, user.playerId)
    binary.bitWriteUnsignedInt(32, user.time)
    const walker = user.walker
    walker.exportStateToMessage(binary)
    if (physicEvent !== undefined) {
      binary.bitWriteUnsignedInt(2, physicEvent.event)
      binary.bitWriteUnsignedInt(24, physicEvent.lastColor)
      binary.bitWriteUnsignedInt(24, physicEvent.newColor)
      binary.bitWriteUnsignedInt(8, physicEvent.eventType)
      binary.bitWriteSignedInt(18, physicEvent.lastSpeedX)
      binary.bitWriteSignedInt(18, physicEvent.lastSpeedY)
    }
    this.sendAll(binary, except(user))
  }
}