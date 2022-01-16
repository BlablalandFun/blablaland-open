// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@blablaland/db";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getJwtAuth } from "../../../src/helpers";

type LoginBody = {
  username: string;
  password: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: { message: "Method not allowed" },
    });
  }

  const errors = {};
  const { password, username } = req.body as LoginBody;

  // on vérifie que le pseudo n'est pas déjà pris
  const user = await prisma.user.findFirst({
    where: {
      protectedUsername: username.toLowerCase(),
    },
  });

  if (!user) {
    errors["username"] = "Identifiant incorrect !";
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      errors["password"] = "Mot de passe incorrect !";
    }
  }

  // il y a des erreurs
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const jwtToken = await getJwtAuth(user.id);
  res.setHeader("Set-Cookie", `SESSION=${jwtToken}; HttpOnly; Path=/;`);

  return res.status(200).json({ errors });
}
