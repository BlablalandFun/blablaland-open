import GameMap from "../../containers/GameMap.js";
import app from "../../services/app.js";
import GP from "../GP.js";
import Binary, { SocketMessage } from "../network/Binary.js";

export default class Camera {

  currentMap?: GameMap;
  nextMap?: GameMap;
  prevMap?: GameMap;

  constructor(
    private readonly cameraId: number,
    private readonly userPid: number
  ) { }

  get user() {
    return app.users.find(user => user.playerId === this.userPid);
  }

  get id() {
    return this.cameraId;
  }

  #getHeader(subtype: number) {
    const binary = new SocketMessage(4, subtype)
    binary.bitWriteUnsignedInt(GP.BIT_CAMERA_ID, this.id)
    return binary
  }

  onMapReady(map: GameMap, errorId: number) {

    const user = this.user
    if (!user) {
      console.log('existe pas :/')
      return
    }
    const definition = map.definition
    const sm = this.#getHeader(1)
    sm.bitWriteUnsignedInt(GP.BIT_ERROR_ID, errorId)
    sm.bitWriteUnsignedInt(GP.BIT_METHODE_ID, 3) // apparition

    // write map definition
    sm.bitWriteSignedInt(17, definition.mapXpos)
    sm.bitWriteSignedInt(17, definition.mapYpos)
    sm.bitWriteUnsignedInt(5, definition.meteoId)
    sm.bitWriteUnsignedInt(GP.BIT_TRANSPORT_ID, definition.transportId)
    sm.bitWriteUnsignedInt(16, definition.peace);

    [user].forEach(u => { // users
      sm.bitWriteBoolean(true)
      sm.bitWriteUnsignedInt(GP.BIT_USER_ID, u.playerId)
      sm.bitWriteUnsignedInt(GP.BIT_USER_PID, u.playerId)
      sm.bitWriteString(u.username)
      sm.bitWriteUnsignedInt(3, 0)
      sm.bitWriteUnsignedInt(32, u.time)

      const walkerData = new Binary()
      user.walker.exportStateToMessage(walkerData)
      sm.bitWriteBinaryData(walkerData)
    })
    sm.bitWriteBoolean(false) // fxList
    user.send(sm)
  }
}