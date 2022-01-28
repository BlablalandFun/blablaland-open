import { Socket } from "net";
import GP from "../libs/GP.js";
import { LimitedInteger } from "../libs/LimitedInteger.js";
import Binary, { SocketMessage } from "../libs/network/Binary.js";
import { MessageData } from "../libs/network/MessageData.js";
import FxManager from "../libs/servers/FxManager.js";
import Camera from "../libs/users/Camera.js";
import UserState from "../libs/users/UserState.js";
import Walker from "../libs/users/Walker.js";
import app from "../services/app.js";
import loader from "../services/loader.js";
import { FxObject, FxOptions, OwnedObject } from "../types/server.js";
import GameMap from "./GameMap.js";

export default class GameUser {
  static readonly LAST_PID: LimitedInteger = new LimitedInteger(0, 2 ** 24 - 1);
  static readonly #MAX_CMPT = 65530;

  readonly #outCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT);
  readonly #inCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT);

  lastPacketTime = 0;

  #buffer: MessageData = new MessageData(0);

  time = 0;
  playerId = 0;

  userId = 0;
  grade = 0;
  xp = 0;
  pseudo = "";
  login = "";

  state = UserState.PLAYING;

  readonly walker = new Walker();
  readonly cameraList: Camera[] = [];

  readonly objectList: OwnedObject[] = [];

  readonly fxMemory: FxManager[] = [];

  constructor(private socket: Socket, public serverId: number) {
    app.objects
      .filter((value) => loader.getObjectHandle(value.id) !== undefined)
      .forEach((value) => {
        const objectData: OwnedObject = {
          ...value,
          objectId: value.id,
          binData: new Binary(),
          id: value.id + 1000,
          quantity: 2 ** 32 - 1,
        };

        this.objectList.push(objectData);
      });
  }

  /**
   * Permet de vérifier si le joueur est dans une map
   * @param mapId - ID de la map
   * @param serverId - ID du serveur où se situe la map
   * @returns
   */
  isInMap(mapId: number, serverId: number) {
    return this.cameraList.some((cam) => cam.isInMap(mapId, serverId));
  }

  get server() {
    return app.servers.find((server) => server.serverId === this.serverId);
  }

  get mainCamera() {
    const camera = this.cameraList[0];
    return camera?.id === 0 ? camera : undefined;
  }

  closeSocket = () => {
    this.socket.destroy();
  };

  onDisconnect = async (_hadError: boolean) => {
    if (this.state === UserState.DISCONNECTING) {
      return;
    }

    this.state = UserState.DISCONNECTING;
    this.cameraList.forEach((camera) => {
      camera.methodeId = GP.BIT_METHODE_APPARITION;
      camera.removeMap();
    });

    const idx = app.users.indexOf(this);
    if (idx > -1) {
      console.log("Suppression du user en mémoire");
      app.users.splice(idx, 1);
    }
  };

  onHandleData = async (data: Buffer) => {
    this.#buffer.push(...data);
    while (!this.#buffer.isFinished()) {
      const message = this.#buffer.next();
      if (message) {
        const currentCmpt = this.#inCmpt.increment();

        const binary = new SocketMessage();
        binary.readMessage(message);
        const inCmpt = binary.bitReadUnsignedInt(16);

        if (inCmpt >= currentCmpt && inCmpt <= currentCmpt + 20) {
          const type = binary.bitReadUnsignedInt(GP.BIT_TYPE);
          const subType = binary.bitReadUnsignedInt(GP.BIT_TYPE);

          try {
            const packetHandler = loader.getPacketHandler(type, subType);
            if (packetHandler) {
              await packetHandler.handle(this, {
                binary,
                subType,
              });
              console.log(`Packet[type=${type}, subType=${subType}]`);
            } else {
              console.warn(`Packet[type=${type}, subType=${subType}] not found`);
            }
          } catch (e) {
            console.log(e);
          }

          this.lastPacketTime = Date.now();
        }
      }
    }
  };

  createUserFx(obj: FxObject, options: FxOptions = {}): [FxManager | undefined, SocketMessage] {
    const secureMap = this.mainCamera?.secureMap;
    if (!secureMap) {
      throw new Error("Not ready");
    }

    const server = this.server;
    if (!server) {
      throw new Error("Unknown server");
    }

    const fxSid = obj.fxSid ?? server.lastFxSid.value;

    const [fxManager, binary] = secureMap.createUserFxChange(this, {
      fxSid,
      fxId: 6,
      binData: GameMap.writeFxData({
        objectId: obj.objectId,
        fxFileId: obj.fxFileId,
        param: obj.binData,
      }),
    });
    if (fxManager) {
      fxManager.options = options;
    }

    return [fxManager, binary];
  }

  sendRemoveUserFx(fxManager: FxManager, endCause = 0) {
    const camera = this.mainCamera;
    if (!camera) {
      return;
    }
    const secureMap = camera.secureMap;
    if (!secureMap) {
      return;
    }
    const [, sm] = secureMap.removeUserFxChange(this, fxManager.fxId, fxManager.fxSid, endCause);
    if (camera.ready) {
      secureMap.sendAll(sm);
    } else {
      this.send(sm);
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
