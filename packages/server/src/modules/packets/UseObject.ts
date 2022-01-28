import GameMap from "../../containers/GameMap.js";
import GameUser from "../../containers/GameUser.js";
import Binary from "../../libs/network/Binary.js";
import loader from "../../services/loader.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class UseObject implements PacketBase {
  type = 6;
  subType = 8;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const packet = params.binary;

    const objId = packet.bitReadUnsignedInt(32);
    const hasData = packet.bitReadBoolean();
    const objectData = hasData ? packet.bitReadBinaryData() : new Binary();

    const camera = user.mainCamera;
    if (!camera) {
      return false;
    }

    if (!camera.ready) {
      return false;
    }

    const currentMap = camera.currMap as GameMap;

    const definition = user.objectList.find((value) => value.id === objId);
    if (!definition) {
      console.warn("Object not found");
      return false;
    }

    const handler = loader.getObjectHandle(definition.objectId);
    if (!handler) {
      console.warn("Object not handled");
      return false;
    }

    return handler.handle({
      map: currentMap,
      definition,
      packet,
      objectData,
      user,
    });
  }
}
