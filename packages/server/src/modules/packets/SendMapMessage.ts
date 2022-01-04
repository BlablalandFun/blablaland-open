import GameUser from "../../containers/GameUser.js";
import { PacketParams } from "../../types/network.js";
import { InterfaceEvent } from "../../types/server.js";
import { PacketBase } from "../PacketBase.js";

export default class SendMapMessage implements PacketBase {
  type: number = 1;
  subType: number = 3;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const packet = params.binary;
    const text = packet.bitReadString();
    const action = packet.bitReadUnsignedInt(3);
    const camera = user.cameraList[0];
    if (!camera) {
      return false;
    }

    const event: InterfaceEvent = {
      serverId: user.serverId,
      pid: user.playerId,
      uid: user.playerId, // this.userId
      pseudo: user.username,
      text,
      action
    };
    camera.currMap?.onMessageMap(event, user.walker.sex);
    return true;
  }

}