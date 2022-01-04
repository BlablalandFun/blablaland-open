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

export type ObjectDefinition = {
  id: number;
  fxFileId: number;
  visibility: number;
  genre: number;
  expireAt: number;
}

export type PacketDefinition = {
  type: number;
  subType: number;
  binary: SocketMessage;
}


export type InterfaceEvent = {
  action?: number;
  pid?: number;
  uid?: number;
  pseudo: string;
  serverId?: number;
  text: string;
}