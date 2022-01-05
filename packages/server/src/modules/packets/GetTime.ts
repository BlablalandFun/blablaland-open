import GameUser from "../../containers/GameUser.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class GetTime implements PacketBase {
  type = 1;
  subType = 1;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const packet = params.binary;

    // GetTime
    user.time = packet.bitReadUnsignedInt(32);

    const time = Date.now();
    const sm = new SocketMessage(1, 1);
    sm.bitWriteUnsignedInt(32, time / 1000);
    sm.bitWriteUnsignedInt(10, time % 1000);
    user.send(sm);
    return true;
  }

}