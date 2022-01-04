import GameUser from "../../containers/GameUser";
import { SocketMessage } from "../../libs/network/Binary";
import { PacketParams } from "../../types/network";
import { PacketBase } from "../PacketBase";

export default class GetPid implements PacketBase {
  type: number = 1;
  subType: number = 3;

  handle(user: GameUser, params: PacketParams): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}