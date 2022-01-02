import GameMap from "../../containers/GameMap.js";
import app from "../../services/app.js";
import GP from "../GP.js";
import Binary, { SocketMessage } from "../network/Binary.js";

export default class Camera {

  /* Correspond à la map actuelle du joueur */
  currMap?: GameMap;

  /* Correspond à la map suivante */
  nextMap?: GameMap;

  /* Correspond à la map précédente */
  prevMap?: GameMap;

  methodeId: number = GP.BIT_METHODE_APPARITION

  constructor(
    private readonly cameraId: number,
    private readonly userPid: number
  ) { }

  isInMap(mapId: number, serverId: number) {
    if (this.currMap) {
      return this.currMap.id === mapId && this.currMap.serverId === serverId
    } else if (this.nextMap) {
      return this.nextMap.id === mapId && this.nextMap.serverId === serverId
    } else if (this.prevMap) {
      return this.prevMap.id === mapId && this.prevMap.serverId === serverId
    }
    return false;
  }

  removeMap() {
    this.prevMap?.onLostUser(this)
    this.currMap?.onLostUser(this)
    this.nextMap?.onLostUser(this)
  }

  get user() {
    return app.users.find(user => user.playerId === this.userPid);
  }

  get playerId() {
    return this.userPid;
  }

  get id() {
    return this.cameraId;
  }

  onMapChange(map: GameMap, errorId: number) {
    const sm = new SocketMessage(3, 5)
    sm.bitWriteUnsignedInt(GP.BIT_CAMERA_ID, this.cameraId)
    sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, map.id)
    sm.bitWriteUnsignedInt(GP.BIT_SERVER_ID, map.serverId)
    sm.bitWriteUnsignedInt(GP.BIT_MAP_FILEID, map.definition.fileId)
    sm.bitWriteUnsignedInt(GP.BIT_METHODE_ID, this.methodeId)
    sm.bitWriteUnsignedInt(GP.BIT_ERROR_ID, errorId)
    this.user?.send(sm)
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
    sm.bitWriteUnsignedInt(GP.BIT_METHODE_ID, this.methodeId) // apparition

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