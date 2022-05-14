import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";

export function random(min = 0, max = 50) {
  let num = Math.random() * (max - min) + min;

  return Math.floor(num);
}

type JwtUserAuth = {
  id: number;
  jti: string;
  iat: number;
  exp: number;
  sub: string;
};

export async function getJwtAuth(userId: number) {
  const jwt = new SignJWT({
    id: userId,
  });
  jwt.setProtectedHeader({ alg: "HS256" });
  jwt.setJti(nanoid());
  jwt.setIssuedAt();
  jwt.setExpirationTime("12h");
  jwt.setSubject("bbl-auth");

  return jwt.sign(new TextEncoder().encode("Blablaland.fun"));
}

export async function checkJwtAuth(token: string) {
  const verified = await jwtVerify(token, new TextEncoder().encode("Blablaland.fun"));
  return verified.payload as JwtUserAuth;
}
