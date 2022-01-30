import Binary from "../libs/network/Binary.js";
import FxManager from "../libs/servers/FxManager.js";

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
};

export type FxObjectIdentity = {
  objectId?: number | undefined;
  fxFileId?: number | undefined;
}

export type FxIdentity = {
  fxId: number;
  fxSid?: number;
}

export type FxMngOptions = {
  object?: FxObject;
  binData: Binary;
  fxSid: number;
  fxId: number;
};

export type FxChangeOptions = FxIdentity & {
  fxSid: number;
  object?: FxObject;
  binData?: Binary;
  active?: boolean;
  endCause?: number;
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
