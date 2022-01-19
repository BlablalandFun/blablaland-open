import GameUser from "../../containers/GameUser.js";
import { PacketParams } from "../../types/network.js";
import { ObjectBase } from "../ObjectBase.js";

export default class Jetpack implements ObjectBase {
  objectId = 11;
  async handle(user: GameUser, _params: PacketParams): Promise<boolean> {
    console.log(user)
    return true;
  }
}
