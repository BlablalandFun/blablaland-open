import GameUser from "../../containers/GameUser.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class GetPid implements PacketBase {
  type = 1;
  subType = 3;

  async handle(user: GameUser, _params: PacketParams): Promise<boolean> {
    if (user.playerId === 0) {
      user.playerId = GameUser.LAST_PID.increment();

      const sm = new SocketMessage(1, 3);
      sm.bitWriteUnsignedInt(24, user.playerId);
      user.send(sm);

      return true;
    }
    return false;
  }
}
