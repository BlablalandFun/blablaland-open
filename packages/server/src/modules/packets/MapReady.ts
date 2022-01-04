import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class MoveCamera implements PacketBase {
  type: number = 3;
  subType: number = 6;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {

    const packet = params.binary;

    const cameraId = packet.bitReadUnsignedInt(GP.BIT_CAMERA_ID)
    const mapId = packet.bitReadUnsignedInt(GP.BIT_MAP_ID)

    const camera = user.cameraList.find(camera => camera.id === cameraId)
    if (!camera) {
      return false;
    }

    const map = user.server?.getMapBy(m => m.id === mapId)
    if (map) {
      camera.onMapReady(map, 0);
      return true;
    }
    return false;
  }

}