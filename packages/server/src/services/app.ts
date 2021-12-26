import crypto from 'crypto';
import maps from '../../files/maps.json' assert { type: 'json' };
import servers from '../../files/servers.json' assert { type: 'json' };
import FlashServer from '../containers/FlashServer.js';
import GameMap from "../containers/GameMap.js";
import GameServer from "../containers/GameServer.js";
import GameUser from "../containers/GameUser.js";

export class Application {
  
  readonly id: string = crypto.randomBytes(8).toString('hex');
  readonly users: GameUser[] = [];
  readonly maps: GameMap[] = [];
  readonly servers: GameServer[] = [];

  async init() {
    await this.initServers()

    this.showMetrics()
  }

  /**
   * Afficher des statistiques de l'application
   * (nombre de joueurs, nombre de maps, RAM utilisée, etc.)
   */
  async showMetrics() {
    const memoryUsage = process.memoryUsage()
    const humanRam = Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100
    console.log(`APP[uptime=${Math.trunc(process.uptime() * 1000)}ms, ram=${humanRam}MB]`)
  }

  async initServers() {
    new FlashServer()
    servers.forEach(server => {
      const gameServer = new GameServer(server);
      this.servers.push(gameServer);
      gameServer.setup(maps);
    })
    return
  }
}

export default new Application();