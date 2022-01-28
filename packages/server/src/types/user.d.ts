import GameMap from "../containers/GameMap.js";
import GameUser from "../containers/GameUser.js";
import Binary from "../libs/network/Binary.js";
import { OwnedObject } from "./server.js";

export type PhysicEvent = {
  event: number;
  lastColor: number;
  newColor: number;
  eventType: number;
  lastSpeedX: number;
  lastSpeedY: number;
};

export type ObjectHandlerOptions = {
  definition: OwnedObject;
  user: GameUser;
  map: GameMap;
  packet: Binary;
  objectData: Binary;
};
