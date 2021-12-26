import net from 'net'
export default class FlashServer {

  static readonly #FLASH_POLICY_FILE = '<cross-domain-policy><allow-access-from to-ports="*" domain="*"/></cross-domain-policy>';
  readonly #packet: Uint8Array;
  readonly #server: net.Server;

  constructor() {
    this.#server = net.createServer(this.#onHandleUser);

    const policy = Buffer.from(FlashServer.#FLASH_POLICY_FILE);
    this.#packet = new Uint8Array([...policy, 0]);
    this.#listen();
  }

  get port() {
    return 843;
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
    socket.on('error', (err) => {
      console.error(err);
    })
    socket.on('data', (data) => this.#onHandleData(socket, data))
  }

  #onHandleData = (socket: net.Socket, data: Buffer) => {
    if (data.toString().startsWith("<policy-file-request/>")) {
      socket.write(Buffer.from(this.#packet))
    }
    socket.end();
  }

}