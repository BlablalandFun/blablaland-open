import { Socket } from 'net';
import GP from '../libs/GP.js';
import { LimitedInteger } from '../libs/LimitedInteger.js';
import { SocketMessage } from '../libs/network/Binary.js';
import { MessageData } from '../libs/network/MessageData.js';
import { Transport } from '../libs/Transport.js';
import Camera from '../libs/users/Camera.js';
import UserState from '../libs/users/UserState.js';
import Walker from '../libs/users/Walker.js';
import app from '../services/app.js';
import { DBMaps, DBServers } from '../services/definitions.js';
import loader from '../services/loader.js';
import { InterfaceEvent, PacketDefinition } from '../types/server.js';
import { PhysicEvent } from '../types/user';

export default class GameUser {

  static readonly LAST_PID: LimitedInteger = new LimitedInteger(0, (2 ** 24) - 1);
  static readonly #MAX_CMPT = 65530

  readonly #outCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT)
  readonly #inCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT)

  lastPacketTime: number = 0;

  #buffer: MessageData = new MessageData(0);

  time: number = 0;
  playerId: number = 0;

  state = UserState.PLAYING;

  readonly walker = new Walker()
  readonly cameraList: Camera[] = [];

  constructor(
    private socket: Socket,
    public serverId: number,
  ) { }

  /**
   * Permet de vérifier si le joueur est dans une map
   * @param mapId - ID de la map
   * @param serverId - ID du serveur où se situe la map
   * @returns 
   */
  isInMap(mapId: number, serverId: number) {
    return this.cameraList.some(cam => cam.isInMap(mapId, serverId));
  }

  get username() {
    return "admin_" + this.playerId
  }

  get server() {
    return app.servers.find(server => server.serverId === this.serverId);
  }

  closeSocket = () => {
    this.socket.destroy();
  }

  onDisconnect = async (hadError: boolean) => {
    if (this.state === UserState.DISCONNECTING) {
      return;
    }

    this.state = UserState.DISCONNECTING;
    this.cameraList.forEach(camera => {
      camera.methodeId = GP.BIT_METHODE_APPARITION;
      camera.removeMap();
    });

    const idx = app.users.indexOf(this);
    if (idx > -1) {
      console.log('Suppression du user en mémoire')
      app.users.splice(idx, 1);
    }
  }

  onHandleData = async (data: Buffer) => {
    this.#buffer.push(...data)
    while (!this.#buffer.isFinished()) {
      const message = this.#buffer.next()
      if (message) {
        const currentCmpt = this.#inCmpt.increment();

        const socketMessage = new SocketMessage()
        socketMessage.readMessage(message)
        const inCmpt = socketMessage.bitReadUnsignedInt(16)

        if (inCmpt >= currentCmpt && inCmpt <= currentCmpt + 20) {
          const packetType = socketMessage.bitReadUnsignedInt(GP.BIT_TYPE);
          const packetSubType = socketMessage.bitReadUnsignedInt(GP.BIT_TYPE);
          const identity: PacketDefinition = {
            type: packetType,
            subType: packetSubType,
            binary: socketMessage,
          }

          try {
            const packetHandler = loader.getPacketHandler(packetType, packetSubType);
            if (packetHandler) {
              await packetHandler.handle(this, {
                binary: socketMessage,
                subType: packetSubType,
              });
            } else {
              await this.#parsePacket(identity);
            }
          } catch (e) {
            console.log(e)
          }

          this.lastPacketTime = Date.now();
        }
      }
    }
  }

  async #parsePacket(packet: PacketDefinition) {

    console.log(`Packet[type=${packet.type}, subType=${packet.subType}]`)

    if (packet.type === 2) {
      // packet de déplacement du joueur
      if (packet.subType === 1 || packet.subType === 2) {

        const mapId = packet.binary.bitReadUnsignedInt(GP.BIT_MAP_ID);
        this.time = packet.binary.bitReadUnsignedInt(32);

        this.walker.readStateFromMessage(packet.binary);

        let physicEvent: PhysicEvent | undefined = undefined;

        if (packet.subType === 2) {
          physicEvent = {
            event: packet.binary.bitReadUnsignedInt(2),
            lastColor: packet.binary.bitReadUnsignedInt(24),
            newColor: packet.binary.bitReadUnsignedInt(24),
            eventType: packet.binary.bitReadUnsignedInt(8),
            lastSpeedX: packet.binary.bitReadSignedInt(18),
            lastSpeedY: packet.binary.bitReadSignedInt(18)
          }
        }

        this.send(new SocketMessage(1, 11));

        const camera = this.cameraList[0]
        if (!camera) {
          return
        }

        camera.currMap?.updatePlayerData(this, physicEvent)

      }
    } else if (packet.type === 3) {
      if (packet.subType === 3) {
        // main camera

        const targetMap = this.server?.getMapBy(map => map.id === 9)
        if (!targetMap) {
          return
        }

        const camera = new Camera(0, this.playerId)
        camera.nextMap = targetMap
        this.cameraList.push(camera)

        const sm = new SocketMessage(3, 2)
        sm.bitWriteUnsignedInt(GP.BIT_ERROR_ID, 0) // inutilisé
        sm.bitWriteUnsignedInt(GP.BIT_CAMERA_ID, camera.id) // id de la camera
        sm.bitWriteString("0129402a0a20333334") // pour les couleurs du tchat
        sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, targetMap.id) // map accueil
        sm.bitWriteUnsignedInt(GP.BIT_MAP_FILEID, targetMap.definition.fileId) // map accueil
        sm.bitWriteBoolean(false) // smileys
        sm.bitWriteBoolean(false) // amis
        sm.bitWriteBoolean(false) // blacklist
        sm.bitWriteBoolean(false) // objets
        this.send(sm)
      } else if (packet.subType === 5) {
        const methodeId = packet.binary.bitReadUnsignedInt(GP.BIT_METHODE_ID)
        const cameraId = packet.binary.bitReadUnsignedInt(GP.BIT_CAMERA_ID)
        const mapId = packet.binary.bitReadUnsignedInt(GP.BIT_MAP_ID)
        const serverId = packet.binary.bitReadUnsignedInt(GP.BIT_SERVER_ID)

        const camera = this.cameraList.find(camera => camera.id === cameraId)
        if (!camera) {
          return
        }

        const targetMap = app.maps.find(map => map.id === mapId && map.serverId === serverId);
        if (!targetMap) {
          return
        }

        camera.methodeId = methodeId
        camera.prevMap = camera.currMap
        camera.currMap = undefined
        camera.nextMap = targetMap
        this.walker.readStateFromMessage(packet.binary);

        camera.onMapChange(targetMap, 0)

      } else if (packet.subType === 6) {
        // mapready

        const cameraId = packet.binary.bitReadUnsignedInt(GP.BIT_CAMERA_ID)
        const mapId = packet.binary.bitReadUnsignedInt(GP.BIT_MAP_ID)

        const camera = this.cameraList.find(camera => camera.id === cameraId)
        if (!camera) {
          return
        }

        const map = this.server?.getMapBy(m => m.id === mapId)
        if (map) {
          camera.onMapReady(map, 0)
        }
      }
    }
  }

  send(binary?: SocketMessage) {
    if (!binary) {
      return;
    }
    const out = new SocketMessage();
    out.bitWriteUnsignedInt(16, this.#outCmpt.increment());

    const buffer = [];
    buffer.push(...out.exportMessage());
    buffer.push(...binary.exportMessage());
    buffer.push(0);
    if (!this.socket.destroyed) {
      this.socket.write(Buffer.from(buffer), (err?: Error) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }
}