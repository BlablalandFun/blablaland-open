import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PhysicEvent } from "../../types/user.js";
import { PacketBase } from "../PacketBase.js";

export default class MoveWalker implements PacketBase {
  type = 2;
  subType: number[] = [1, 2];

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const packet = params.binary;

    const mapId = packet.bitReadUnsignedInt(GP.BIT_MAP_ID);
    user.time = packet.bitReadUnsignedInt(32);

    user.walker.readStateFromMessage(packet);

    let physicEvent: PhysicEvent | undefined = undefined;

    if (params.subType === 2) {
      physicEvent = {
        event: packet.bitReadUnsignedInt(2),
        lastColor: packet.bitReadUnsignedInt(24),
        newColor: packet.bitReadUnsignedInt(24),
        eventType: packet.bitReadUnsignedInt(8),
        lastSpeedX: packet.bitReadSignedInt(18),
        lastSpeedY: packet.bitReadSignedInt(18)
      }
    }

    user.send(new SocketMessage(1, 11));

    const camera = user.cameraList[0]
    if (!camera) {
      return false;
    }

    if (camera.currMap?.id !== mapId) {
      return false;
    }

    camera.currMap?.updatePlayerData(user, physicEvent);
    return true;
  }

}