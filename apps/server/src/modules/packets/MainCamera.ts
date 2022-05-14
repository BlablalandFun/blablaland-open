import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import Camera from "../../libs/users/Camera.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class MainCamera implements PacketBase {
  type = 3;
  subType = 3;

  async handle(user: GameUser, _params: PacketParams): Promise<boolean> {
    const targetMap = user.server?.getMapBy((map) => map.id === 9);
    if (!targetMap) {
      return false;
    }

    const camera = new Camera(0, user.playerId);
    camera.nextMap = targetMap;
    user.cameraList.push(camera);

    const sm = new SocketMessage(3, 2);
    sm.bitWriteUnsignedInt(GP.BIT_ERROR_ID, 0); // inutilisé
    sm.bitWriteUnsignedInt(GP.BIT_CAMERA_ID, camera.id); // id de la camera
    sm.bitWriteString("0129402a0a20333334"); // pour les couleurs du tchat
    sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, targetMap.id); // map accueil
    sm.bitWriteUnsignedInt(GP.BIT_MAP_FILEID, targetMap.definition.fileId); // map accueil
    sm.bitWriteBoolean(false); // smileys
    sm.bitWriteBoolean(false); // amis
    sm.bitWriteBoolean(false); // blacklist
    user.objectList.forEach((value) => {
      sm.bitWriteBoolean(true);
      sm.bitWriteUnsignedInt(8, 0); // action
      sm.bitWriteUnsignedInt(32, value.id); // db id
      sm.bitWriteUnsignedInt(GP.BIT_FX_ID, value.fxFileId);
      sm.bitWriteUnsignedInt(GP.BIT_FX_SID, value.objectId);
      sm.bitWriteUnsignedInt(32, value.quantity);
      sm.bitWriteUnsignedInt(32, value.expireAt);
      sm.bitWriteUnsignedInt(3, value.visibility);
      sm.bitWriteUnsignedInt(5, value.genre);
      sm.bitWriteBinaryData(value.binData);
    });
    sm.bitWriteBoolean(false); // objets
    user.send(sm);
    return true;
  }
}
