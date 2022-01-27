import Binary from "../../libs/network/Binary.js";
import app from "../../services/app.js";
import { ObjectHandlerOptions } from "../../types/user.js";
import { ObjectBase } from "../ObjectBase.js";

export default class Jetpack implements ObjectBase {
  objectId = 11;
  async handle(options: ObjectHandlerOptions): Promise<boolean> {
    console.log(options);

    const { definition, user } = options;
    if (definition.quantity <= 0) {
      return false;
    }

    const idxFx = user.fxMemory.findIndex((fx) => {
      return fx.objectId === definition.objectId;
    });
    if (idxFx < 0) {
      // pas en cours
      const binData = new Binary();
      binData.bitWriteUnsignedInt(32, definition.quantity);
      binData.bitWriteUnsignedInt(32, app.getTime());
      const [fxManager, sm] = user.createUserFx({
        objectId: definition.objectId,
        fxFileId: definition.fxFileId,
        binData,
      });
      if (!fxManager) {
        return false;
      }
      current

    }

    return true;
  }
}
