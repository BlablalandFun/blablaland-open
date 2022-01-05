import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class Login implements PacketBase {
  type = 1;
  subType = 2;

  async handle(user: GameUser, _params: PacketParams): Promise<boolean> {

    console.log('ici')

    const sm = new SocketMessage(2, 1);
    sm.bitWriteUnsignedInt(GP.BIT_USER_ID, user.playerId) // userId
    sm.bitWriteString(user.username) // pseudo
    sm.bitWriteUnsignedInt(GP.BIT_GRADE, 9999) // grade
    sm.bitWriteUnsignedInt(32, 9999) // xp
    user.send(sm);
    return true;
  }

}