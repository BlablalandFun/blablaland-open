import { Socket } from 'net'
import GameServer from './GameServer.js';
import maps from '../files/maps.json';
import servers from '../files/servers.json';
import { SocketMessage } from './libs/network/Binary.js';
import GP from './libs/GP.js';
import { LimitedInteger } from './libs/LimitedInteger.js';
import { MessageData } from './libs/network/MessageData.js';
import { PacketDefinition } from './types/server.js';
import { Transport } from './libs/Transport.js';

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

    console.log(`Packet[type=${packet.type}, subType=${packet.subType}]`)

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
        const transportList = [
          new Transport(1),
        ]

        const sm = new SocketMessage(1, 4)
        transportList.forEach((transport) => {
          sm.bitWriteBoolean(true)
          sm.bitWriteUnsignedInt(GP.BIT_TRANSPORT_ID, transport.id)

          if (transport.maps.length) { // on écrit les maps
            sm.bitWriteBoolean(true)
            sm.bitWriteUnsignedInt(4, 0)
            transport.maps.map((map) => {
              sm.bitWriteBoolean(true)
              sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, map)
            })
            sm.bitWriteBoolean(false)
          }

          if (transport.values.length) {
            sm.bitWriteBoolean(true)
            sm.bitWriteUnsignedInt(4, 1)
            transport.values.forEach((value) => {
              sm.bitWriteBoolean(true)
              sm.bitWriteUnsignedInt(10, value.time)
              sm.bitWriteUnsignedInt(5, value.value)
            })
            sm.bitWriteBoolean(false)
          }
          sm.bitWriteBoolean(false)
        })
        sm.bitWriteBoolean(false)

        maps.forEach((map) => {
          sm.bitWriteBoolean(true)
          sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, map.id)
          sm.bitWriteUnsignedInt(GP.BIT_MAP_FILEID, map.fileId)
          sm.bitWriteString(map.nom)
          sm.bitWriteUnsignedInt(GP.BIT_TRANSPORT_ID, map.transportId)
          sm.bitWriteSignedInt(17, map.mapXpos)
          sm.bitWriteSignedInt(17, map.mapYpos)
          sm.bitWriteUnsignedInt(5, map.meteoId)
          sm.bitWriteUnsignedInt(2, map.peace)
          sm.bitWriteUnsignedInt(GP.BIT_MAP_REGIONID, map.regionId)
          sm.bitWriteUnsignedInt(GP.BIT_MAP_PLANETID, map.planetId)
        })

        sm.bitWriteBoolean(false)

        servers.forEach((server) => { // écriture des serveurs
          sm.bitWriteBoolean(true)
          sm.bitWriteString(server.nom)
          sm.bitWriteUnsignedInt(16, server.port)
        })
        sm.bitWriteBoolean(false)

        sm.bitWriteUnsignedInt(GP.BIT_SERVER_ID, this.serverId)
        sm.bitWriteUnsignedInt(8, 1)
        this.send(sm)

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