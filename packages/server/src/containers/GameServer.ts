import { createServer, Server, Socket } from 'net';
import maps from '../../files/maps.json';
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
      const gameMap = new GameMap(this.serverId, definition);
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


  #onHandleUser = (socket: Socket) => {
    const user = new GameUser(socket, this.serverId);
    socket.on('error', (err) => {
      console.error(err);
    })

    socket.on('data', user.onHandleData);
  }

}