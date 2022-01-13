import { Socket } from "net";
import GP from "../libs/GP.js";
import { LimitedInteger } from "../libs/LimitedInteger.js";
import { SocketMessage } from "../libs/network/Binary.js";
import { MessageData } from "../libs/network/MessageData.js";
import Camera from "../libs/users/Camera.js";
import UserState from "../libs/users/UserState.js";
import Walker from "../libs/users/Walker.js";
import app from "../services/app.js";
import loader from "../services/loader.js";

export default class GameUser {
  static readonly LAST_PID: LimitedInteger = new LimitedInteger(0, 2 ** 24 - 1);
  static readonly #MAX_CMPT = 65530;

  readonly #outCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT);
  readonly #inCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT);

  lastPacketTime = 0;

  #buffer: MessageData = new MessageData(0);

  time = 0;
  playerId = 0;

  state = UserState.PLAYING;

  readonly walker = new Walker();
  readonly cameraList: Camera[] = [];

  constructor(private socket: Socket, public serverId: number) {}

  /**
   * Permet de vérifier si le joueur est dans une map
   * @param mapId - ID de la map
   * @param serverId - ID du serveur où se situe la map
   * @returns
   */
  isInMap(mapId: number, serverId: number) {
    return this.cameraList.some((cam) => cam.isInMap(mapId, serverId));
  }

  get username() {
    return "admin_" + this.playerId;
  }

  get server() {
    return app.servers.find((server) => server.serverId === this.serverId);
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
            } else {
              console.warn(`Packet[type=${type}, subType=${subType}] not found`);
            }
          } catch (e) {
            console.log(e);
          }

          console.log(`Packet[type=${type}, subType=${subType}]`);

          this.lastPacketTime = Date.now();
        }
      }
    }
  };

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
