import fs from 'node:fs/promises';
import { PacketBase } from '../modules/PacketBase.js';
import app from './app.js';

class ModuleLoader {

  readonly #packets: PacketBase[] = [];

  async loadPackets() {
    
    const nextPackets = [];
    const packetsDir = app.projectRoot + '/modules/packets/';
    try {
      const files = await fs.readdir(packetsDir);
      for (const file of files) {
        if (file.endsWith('.js') && !file.endsWith('.bak.js')) {
          const packetClass = await import(packetsDir + file);
          const packetClassInstance: PacketBase = new packetClass();
          nextPackets.push(packetClassInstance);
        }
      }
    } catch (e) {
      
    }
    this.#packets.length = 0;
    // this.#packets.push(...nextPackets);
  }

  getPacketHandler(type: number, subType: number) {
    return this.#packets.find(packet => packet.type === type && packet.subType === subType);
  }
}

export default new ModuleLoader();