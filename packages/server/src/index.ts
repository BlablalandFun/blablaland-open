import GameServer from './GameServer.js';
import FlashServer from './services/FlashServer.js';

new FlashServer();
for (let serverId = 0; serverId < 3; serverId++) {
  new GameServer(serverId);
}