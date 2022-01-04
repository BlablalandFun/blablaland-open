import fs from 'node:fs/promises';
import { PacketBase } from '../modules/PacketBase.js';
import app from './app.js';

class ModuleLoader {

  readonly #packets: PacketBase[] = [];

  async loadPackets() {

    const nextPackets = [];
    const packetsDir = app.projectRoot + '/modules/packets/';

    const files: string[] = [];
    try {
      files.push(...await fs.readdir(packetsDir));
    } catch (e) {
      console.error(e);
    }

    for (const file of files) {
      if (file.endsWith('.js') && !file.endsWith('.bak.js')) {
        try {
          const packetClass = await import(packetsDir + file);
          const packetClassInstance: PacketBase = new packetClass.default();
          nextPackets.push(packetClassInstance);
        } catch (exc) {
          console.error(exc);
        }
      }
    }
    this.#packets.length = 0;
    this.#packets.push(...nextPackets);

    console.log(`Loader[count=${this.#packets.length}, type=PACKET]`);
  }

  getPacketHandler(type: number, subType: number) {
    return this.#packets.find(packet => packet.type === type && packet.subType === subType);
  }
}

export default new ModuleLoader();