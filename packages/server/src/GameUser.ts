import { Socket } from 'net'
import GameServer from './GameServer.js';
import { SocketMessage } from './libs/network/Binary.js';
import GP from './libs/GP.js';
import { LimitedInteger } from './libs/LimitedInteger.js';
import { MessageData } from './libs/network/MessageData.js';
import { PacketDefinition } from './types/server.js';

export default class GameUser {

  static readonly #LAST_PID: LimitedInteger = new LimitedInteger(0, (2 ** 24) - 1);
  static readonly #MAX_CMPT = 65530

  readonly #outCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT)
  readonly #inCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT)
  
  #buffer: MessageData = new MessageData(0);

  time: number = 0;
  playerId: number = 0;


  constructor(
    private socket: Socket,
    public serverId: number,
  ) { }

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

          await this.#parsePacket(identity);
        }
      }
    }
  }

  async #parsePacket(packet: PacketDefinition) {
    if (packet.type === 1) {
      if (packet.subType === 1) { // GetTime
        this.time = packet.binary.bitReadUnsignedInt(32);
        
        const time = Date.now();
        const sm = new SocketMessage(1, 1);
        sm.bitWriteUnsignedInt(32, time / 1000);
        sm.bitWriteUnsignedInt(10, time % 1000);
        this.send(sm);
      } else if (packet.subType === 3) { // AskPid
        if (this.playerId === 0) {
          this.playerId = GameUser.#LAST_PID.increment();

          const sm = new SocketMessage(1, 3);
          sm.bitWriteUnsignedInt(24, this.playerId);
          this.send(sm);
        }
      } else if (packet.subType === 6) {
        // ask variables
        console.log('ask variables')

        const sm = new SocketMessage(1, 4)
        

      } else if (packet.subType === 17) {
        // packet pour la webradio
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
    this.socket.write(Buffer.from(buffer), (err?: Error) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
}