import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import app from "../../services/app.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class MoveCamera implements PacketBase {
  type = 3;
  subType = 5;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {

    const packet = params.binary;
    const methodeId = packet.bitReadUnsignedInt(GP.BIT_METHODE_ID)
    const cameraId = packet.bitReadUnsignedInt(GP.BIT_CAMERA_ID)
    const mapId = packet.bitReadUnsignedInt(GP.BIT_MAP_ID)
    const serverId = packet.bitReadUnsignedInt(GP.BIT_SERVER_ID)

    const camera = user.cameraList.find(camera => camera.id === cameraId)
    if (!camera) {
      return false;
    }

    const targetMap = app.maps.find(map => map.id === mapId && map.serverId === serverId);
    if (!targetMap) {
      return false;
    }

    camera.methodeId = methodeId
    camera.prevMap = camera.currMap
    camera.currMap = undefined
    camera.nextMap = targetMap
    user.walker.readStateFromMessage(packet);

    camera.onMapChange(targetMap, 0)
    return true;
  }

}