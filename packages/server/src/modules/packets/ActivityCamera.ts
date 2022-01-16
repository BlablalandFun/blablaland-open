import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import Binary from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class MoveCamera implements PacketBase {
  type = 9;
  subType = 2;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const packet = params.binary;

    const askType = packet.bitReadUnsignedInt(16);
    const cameraId = packet.bitReadUnsignedInt(GP.BIT_CAMERA_ID);

    const camera = user.cameraList.find((camera) => camera.id === cameraId);
    if (!camera) {
      return false;
    }

    const secureMap = camera.currMap ?? camera.nextMap;
    if (!secureMap) {
      return false;
    }

    if (askType === 1) {
      // scène irwish

      const time = Date.now();
      const binData = new Binary();
      binData.bitWriteUnsignedInt(32, time / 1000);
      binData.bitWriteUnsignedInt(10, time % 1000);
      const [_, sm] = secureMap.createMapFx({
        objectId: 0,
        fxFileId: 24,
        binData,
      });
      user.send(sm);
    }
    return false;
  }
}
