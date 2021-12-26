import GP from "../libs/GP.js";
import { SocketMessage } from "../libs/network/Binary.js";
import { MapDefinition } from "../types/server";

export default class GameMap {

  constructor(
    readonly id: number,
    readonly serverId: number,
    readonly definition: MapDefinition
  ) { }


  #getHeader(subType: number) {
    const binary = new SocketMessage(5, subType)
    binary.bitWriteUnsignedInt(GP.BIT_MAP_ID, this.id)
    binary.bitWriteUnsignedInt(GP.BIT_SERVER_ID, this.serverId)
    return binary
  }
}