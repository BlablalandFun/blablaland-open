import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import Binary from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class UseObject implements PacketBase {
  type = 6;
  subType = 8;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const packet = params.binary;

    const _objId = packet.bitReadUnsignedInt(32);
    const hasData = packet.bitReadBoolean();
    const _binData = hasData ? packet.bitReadBinaryData() : new Binary();

    const camera = user.mainCamera;
    if (!camera) {
      return false;
    }

    // const map = user.server?.getMapBy((m) => m.id === mapId);
    // if (map) {
    //   camera.onMapReady(map, 0);
    //   return true;
    // }
    return false;
  }
}
