// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@blablaland/db";
import type { NextApiRequest, NextApiResponse } from "next";
import nookies, { destroyCookie } from "nookies";
import { checkJwtAuth } from "../../src/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: { message: "Method not allowed" },
    });
  }

  const { SESSION } = nookies.get({ req });
  if (!SESSION) {
    return res.status(401).json({
      error: { message: "Authentification required" },
    });
  }

  try {
    const userAuth = await checkJwtAuth(SESSION);
    const { username } = await prisma.user.findFirst({
      select: {
        username: true,
      },
      where: {
        id: userAuth.id,
      },
    });
    return res.status(200).json({ username });
  } catch (err) {
    destroyCookie({ res }, "SESSION", { path: "/" });
    return res.status(401).json({});
  }
}
