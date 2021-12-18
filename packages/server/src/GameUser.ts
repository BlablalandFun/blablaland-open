import { Socket } from 'net'
import { SocketMessage } from './libs/Binary.js';
import GP from './libs/GP.js';
import { LimitedInteger } from './libs/LimitedInteger.js';
import { MessageData } from './libs/MessageData.js';

export default class GameUser {


  static readonly #MAX_CMPT = 65530


  #buffer: MessageData = new MessageData(0)
  playerId: number = 0;

  readonly #outCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT)
  readonly #inCmpt: LimitedInteger = new LimitedInteger(12, GameUser.#MAX_CMPT)

  constructor(
    private socket: Socket,
    public serverId: number,
  ) { }

  onHandleData = (data: Buffer) => {
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
          const identity = {
            packetType,
            packetSubType,
            inCmpt,
          }

          console.log(identity)
        }
      }
    }
  }

  parsePacket() {
    
  }
}