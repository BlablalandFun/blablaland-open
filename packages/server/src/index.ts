import GameServer from './GameServer.js';

for (let serverId = 0; serverId < 3; serverId++) {
  new GameServer(serverId);
}