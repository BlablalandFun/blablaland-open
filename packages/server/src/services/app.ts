import crypto from "crypto";
import cron from "node-cron";
import { ConfigServer } from "../config/server.js";
import FlashServer from "../containers/FlashServer.js";
import GameMap from "../containers/GameMap.js";
import GameServer from "../containers/GameServer.js";
import GameUser from "../containers/GameUser.js";
import { MapDefinition, ObjectDefinition, ServerDefinition } from "../types/server";
import loader from "./loader.js";

export class Application {
  readonly id: string = crypto.randomBytes(8).toString("hex");
  readonly users: GameUser[] = [];
  readonly maps: GameMap[] = [];
  readonly servers: GameServer[] = [];
  readonly objects: ObjectDefinition[] = [];

  #projectRoot?: string;

  getTime() {
    return Math.trunc(Date.now() / 1000);
  }

  async init(rootDir: string) {
    this.#projectRoot = rootDir;

    await this.initServers();

    loader.loadPackets();
    loader.loadObjects();

    cron.schedule("*/5 * * * *", () => this.showMetrics());
    // cron.schedule('* * * * * *', () => this.purgeInactive())
    this.showMetrics();
  }

  get projectRoot() {
    return this.#projectRoot;
  }

  async importDefinitions<T>(definitionType: "maps" | "objects" | "servers"): Promise<T> {
    const definitionUrl = `${this.projectRoot}/files/${definitionType}.json`;
    const data = await import(definitionUrl, {
      assert: { type: "json" },
    });
    return data.default;
  }

  purgeInactive(): void {
    this.users
      .filter((user) => user.lastPacketTime !== 0)
      .forEach((user) => {
        if (user.lastPacketTime + ConfigServer.TIMEOUT <= Date.now()) {
          user.closeSocket();
          return;
        }
      });
  }

  /**
   * Afficher des statistiques de l'application
   * (nombre de joueurs, nombre de maps, RAM utilisée, etc.)
   */
  async showMetrics() {
    const memoryUsage = process.memoryUsage();
    const humanRam = Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100;
    console.log(`APP[uptime=${Math.trunc(process.uptime() * 1000)}ms, ram=${humanRam}MB]`);
  }

  async initServers() {
    new FlashServer();
    const DBMaps = await this.importDefinitions<MapDefinition[]>("maps");
    const DBServers = await this.importDefinitions<ServerDefinition[]>("servers");
    DBServers.forEach((server) => {
      const gameServer = new GameServer(server);
      this.servers.push(gameServer);
      gameServer.setup(DBMaps);
    });
    return;
  }
}

export default new Application();
