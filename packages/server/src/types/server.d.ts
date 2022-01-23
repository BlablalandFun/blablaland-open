export type ServerDefinition = {
  id: number;
  port: number;
  nom: string;
};

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
};

export type ObjectDefinition = {
  id: number;
  fxFileId: number;
  visibility: number;
  genre: number;
  expireAt: number;
};

export type PacketDefinition = {
  type: number;
  subType: number;
  binary: SocketMessage;
};

export type InterfaceEvent = {
  action?: number;
  pid?: number;
  uid?: number;
  pseudo: string;
  serverId?: number;
  text: string;
};

export type OwnedObject = ObjectDefinition & {
  objectId: number;
  quantity: number;
  binData: Binary;
};

export type FxObject = {
  objectId: number;
  fxFileId: number;
  binData: Binary;
  fxSid?: number;
};

export type FxMngOptions = {
  objectId?: number | undefined;
  fxFileId?: number | undefined;
  binData: Binary;
  fxSid: number;
  fxId: number;
};

export type FxChangeOptions = {
  binData?: Binary;
  fxId: number;
  fxSid: number;
  active: boolean;
  endCause: number;
};

export type MapFxChange = {
  fxId: number;
  fxSid: number;
  active: boolean;
  endCause: number;
  param?: Binary;
};

export type NewMapFxChangeOptions = {
  fxId: number;
  fxSid: number;
  binData?: Binary;
};

export type FxDataOptions = {
  objectId: number;
  fxFileId: number;
  param?: Binary;
};

export type FxConsumer = {
  fxManager?: FxManager;
  binary: SocketMessage;
};

export type FxOptions = {
  expireAt?: number;
};
