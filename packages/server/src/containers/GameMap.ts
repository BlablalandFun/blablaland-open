import { MapDefinition } from "../types/server";

export default class GameMap {

  constructor(readonly serverId: number, readonly definition: MapDefinition) {
    
  }

}