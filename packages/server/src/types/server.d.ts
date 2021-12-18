export type PacketDefinition = {
  type: number;
  subType: number;
  binary: SocketMessage;
}