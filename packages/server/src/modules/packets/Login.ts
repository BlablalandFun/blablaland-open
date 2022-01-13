import { prisma } from "@blablaland/db";
import { jwtVerify } from "jose";
import { TextEncoder } from "util";
import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

type JwtUserAuth = {
  id: number;
  jti: string;
  iat: number;
  exp: number;
  sub: string;
};

async function checkJwtAuth(token: string) {
  const verified = await jwtVerify(token, new TextEncoder().encode("Blablaland.fun"));
  return verified.payload as JwtUserAuth;
}

export default class Login implements PacketBase {
  type = 1;
  subType = 2;

  async handle(user: GameUser, params: PacketParams): Promise<boolean> {
    const session = params.binary.bitReadString();
    try {
      const jwtUser = await checkJwtAuth(session);

      const dbUser = await prisma.user.findFirst({
        select: {
          username: true,
          grade: true,
          xp: true,
        },
        where: {
          id: jwtUser.id,
        },
      });
      if (!dbUser) {
        throw new Error("User not found");
      }

      const sm = new SocketMessage(2, 1);
      sm.bitWriteUnsignedInt(GP.BIT_USER_ID, user.playerId); // userId
      sm.bitWriteString(dbUser.username); // pseudo
      sm.bitWriteUnsignedInt(GP.BIT_GRADE, dbUser.grade); // grade
      sm.bitWriteUnsignedInt(32, dbUser.xp); // xp
      user.send(sm);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
