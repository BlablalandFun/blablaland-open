import fs from "node:fs/promises";
import { ObjectBase } from "../modules/ObjectBase.js";
import { PacketBase } from "../modules/PacketBase.js";
import app from "./app.js";

class ModuleLoader {
  readonly #packets: PacketBase[] = [];
  readonly #objects: ObjectBase[] = [];

  async loadObjects() {
    const nextObjects = [];
    const packetsDir = app.projectRoot + "/modules/objects/";

    const files: string[] = [];
    try {
      files.push(...(await fs.readdir(packetsDir)));
    } catch (e) {
      console.error(e);
    }

    for (const file of files) {
      if (file.endsWith(".js") && !file.endsWith(".bak.js")) {
        try {
          const packetClass = await import(packetsDir + file);
          const packetClassInstance: ObjectBase = new packetClass.default();
          if (Array.isArray(packetClassInstance.objectId)) {
            for (const objectId of packetClassInstance.objectId) {
              const handlerClass: ObjectBase = new packetClass.default();
              handlerClass.objectId = objectId;
              nextObjects.push(handlerClass);
            }
          } else {
            nextObjects.push(packetClassInstance);
          }
        } catch (exc) {
          console.error(exc);
        }
      }
    }
    this.#objects.length = 0;
    this.#objects.push(...nextObjects);

    console.log(`Loader[count=${this.#objects.length}, type=OBJECT]`);
  }

  getObjectHandle(objectId: number) {
    return this.#objects.find((packet) => packet.objectId === objectId);
  }

  async loadPackets() {
    const nextPackets = [];
    const packetsDir = app.projectRoot + "/modules/packets/";

    const files: string[] = [];
    try {
      files.push(...(await fs.readdir(packetsDir)));
    } catch (e) {
      console.error(e);
    }

    for (const file of files) {
      if (file.endsWith(".js") && !file.endsWith(".bak.js")) {
        try {
          const packetClass = await import(packetsDir + file);
          const packetClassInstance: PacketBase = new packetClass.default();
          if (Array.isArray(packetClassInstance.subType)) {
            for (const subType of packetClassInstance.subType) {
              const handlerClass: PacketBase = new packetClass.default();
              handlerClass.subType = subType;
              nextPackets.push(handlerClass);
            }
          } else {
            nextPackets.push(packetClassInstance);
          }
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
    return this.#packets.find((packet) => packet.type === type && packet.subType === subType);
  }
}

export default new ModuleLoader();
