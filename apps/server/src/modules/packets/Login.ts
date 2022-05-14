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
      console.log(`Login: ${session}`);
      const jwtUser = await checkJwtAuth(session);

      const dbUser = await prisma.user.findFirst({
        select: {
          id: true,
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

      user.userId = dbUser.id;
      user.login = dbUser.username;
      user.pseudo = dbUser.username;
      user.grade = dbUser.grade;
      user.xp = dbUser.xp;

      const sm = new SocketMessage(2, 1);
      sm.bitWriteUnsignedInt(GP.BIT_USER_ID, user.userId); // userId
      sm.bitWriteString(user.pseudo); // pseudo
      sm.bitWriteUnsignedInt(GP.BIT_GRADE, user.grade); // grade
      sm.bitWriteUnsignedInt(32, user.xp); // xp
      user.send(sm);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
