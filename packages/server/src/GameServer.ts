import net from 'net'

export default class GameServer {

  private static DEFAULT_SERVER_ID = 12301;

  private server: net.Server;

  users: any[];

  constructor(private serverId: number) {
    this.users = [];

    this.listen();
  }


  private listen() {
    const port = GameServer.DEFAULT_SERVER_ID + this.serverId;

    const server = this.server = net.createServer(this.onHandleUser);
    server.on('error', (err) => {
      console.error(err);
    });
    server.on('listening', () => {
      console.log(`Server ${this.serverId} listening`);
    })
    server.listen(port);
  }


  onHandleUser = (socket: net.Socket) => {
    socket.on('error', (err) => {
      console.error(err);
    })

    socket.on('data', (data) => {
      console.log('data', data.toString());
    })
  }


}