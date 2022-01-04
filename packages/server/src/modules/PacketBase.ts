import GameUser from "../containers/GameUser";
import { PacketParams } from "../types/network";

export interface PacketBase {
  readonly type: number;
  readonly subType: number | number[];

  /**
   * Permet de s'occuper des packets reçus
   */
  handle(user: GameUser, params: PacketParams): Promise<boolean>;
}