import ms from 'ms';
import { createServer, Server, Socket } from 'net';
import { ConfigServer } from '../config/server.js';
import app from '../services/app.js';
import { MapDefinition, ServerDefinition } from '../types/server.js';
import GameMap from './GameMap.js';
import GameUser from './GameUser.js';


export default class GameServer {

  readonly #server: Server;
  static #DEFAULT_SERVER_ID = 12301;

  users: any[] = [];

  constructor(readonly definition: ServerDefinition) {
    this.#server = createServer(this.#onHandleUser);
  }

  get socket() {
    return this.#server;
  }

  get name() {
    return this.definition.nom;
  }

  get serverId() {
    return this.definition.id;
  }

  get port() {
    return GameServer.#DEFAULT_SERVER_ID + this.serverId;
  }

  log(state: string) {
    console.log(`Server[port=${this.port}, state=${state}]`);
  }

  async setup(definitions: MapDefinition[]) {
    definitions.forEach((definition) => {
      const gameMap = new GameMap(definition.id, this.serverId, definition);
      app.maps.push(gameMap);
    })
    this.log('SETUP');
    return await this.#listen();
  }

  async #listen() {
    if (this.#server.listening) {
      return false
    }
    this.#server.on('error', (err) => {
      console.error(err);
    });
    this.#server.on('listening', () => {
      this.log('LISTEN');
    })
    this.#server.listen(this.port);
    return true;
  }

  getMapBy(predicate: (map: GameMap) => boolean) {
    return app.maps.find(predicate);
  }


  #onHandleUser = (socket: Socket) => {
    console.log('handle user')
    const user = new GameUser(socket, this.serverId);
    app.users.push(user)
    socket.on('error', (err) => {
      console.error(err);
    });
    socket.on('timeout', () => socket.destroy())
    socket.on('close', () => {
      user.cameraList.forEach(camera => camera.removeMap());

      const idx = app.users.indexOf(user);
      if (idx > -1) {
        console.log('Suppression du user en mémoire')
        app.users.splice(idx, 1);
      }
    });

    socket.on('data', user.onHandleData);

    socket.setNoDelay(true);
    socket.setTimeout(ConfigServer.TIMEOUT);
    socket.setKeepAlive(true, ConfigServer.TIMEOUT);
  }

}