import GP from "../../libs/GP.js";
import { ObjectHandlerOptions } from "../../types/user.js";
import { ObjectBase } from "../ObjectBase.js";

export default class Teleporter implements ObjectBase {
  objectId = 3;
  async handle(options: ObjectHandlerOptions): Promise<boolean> {
    const { definition, user, camera } = options;
    if (definition.quantity <= 0) {
      return false;
    }

    const mapId = options.objectData.bitReadUnsignedInt(GP.BIT_MAP_ID);
    const targetMap = user.server?.getMapBy((map) => map.id === mapId);
    if (!targetMap) {
      // la map n'existe pas
      return false;
    }

    // on téléporte le joueur
    camera.methodeId = GP.BIT_METHODE_TELEPORT;
    camera.gotoMap(targetMap, { defaultPos: true });

    return true;
  }
}
