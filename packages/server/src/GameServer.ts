import net from 'net';
import GameUser from './GameUser.js';

export default class GameServer {

  static #DEFAULT_SERVER_ID = 12301;

  #server: net.Server;

  users: any[];

  constructor(private serverId: number) {
    this.users = [];

    this.#server = net.createServer(this.#onHandleUser);
    this.#listen();
  }

  get port() {
    return GameServer.#DEFAULT_SERVER_ID + this.serverId;
  }

  #listen() {
    this.#server.on('error', (err) => {
      console.error(err);
    });
    this.#server.on('listening', () => {
      console.log(`Server ${this.port} listening`);
    })
    this.#server.listen(this.port);
  }


  #onHandleUser = (socket: net.Socket) => {
    const user = new GameUser(socket, this.serverId);
    socket.on('error', (err) => {
      console.error(err);
    })
    
    socket.on('data', user.onHandleData);
  }

}