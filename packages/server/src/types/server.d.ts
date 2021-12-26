import servers from '../files/servers.json';

export type ServerDefinition = {
  id: number;
  port: number;
  nom: string;
}

export type MapDefinition = {
  id: number;
  fileId: number;
  nom: string;
  transportId: number;
  mapXpos: number;
  mapYpos: number;
  meteoId: number;
  peace: number;
  regionId: number;
  planetId: number;
}

export type PacketDefinition = {
  type: number;
  subType: number;
  binary: SocketMessage;
}