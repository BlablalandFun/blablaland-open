import GameUser from "../containers/GameUser";
import { PacketParams } from "../types/network";

export interface ObjectBase {
  objectId: number | number[];

  /**
   * Permet de s'occuper des packets reçus
   */
  handle(user: GameUser, params: PacketParams): Promise<boolean>;
}
