// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@blablaland/db";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getJwtAuth } from "../../../src/helpers";

type RegistrationBody = {
  username: string;
  password: string;
  confirmPassword: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: { message: "Method not allowed" },
    });
  }

  const errors = {};

  const { password, username, confirmPassword } = req.body as RegistrationBody;

  if (!password || !username || !confirmPassword) {
    if (!username) {
      errors["username"] = "Un pseudo doit être renseigné";
    }
    if (!password) {
      errors["password"] = "Un mot de passe doit être renseigné";
    }
    if (!confirmPassword) {
      errors["confirmPassword"] = "Tu dois confirmer ton mot de passe";
    }
  } else if (username.length < 3 || username.length > 12) {
    errors["username"] = "Le pseudo doit faire entre 3 et 12 caractères";
  } else if (password !== confirmPassword) {
    errors["confirmPassword"] = "Les mots de passe ne correspondent pas";
  }

  // on vérifie que le pseudo n'est pas déjà pris
  const other = await prisma.user.findFirst({
    where: {
      protectedUsername: username.toLowerCase(),
    },
  });
  if (other) {
    console.log(other);
    errors["username"] = "Ce pseudo est déjà pris";
  }

  // il y a des erreurs
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const hashedPassword = await bcrypt.hash(password, 7);

  // on créé le user
  const user = await prisma.user.create({
    data: {
      username,
      protectedUsername: username.toLowerCase(),
      password: hashedPassword,
    },
  });

  const jwtToken = await getJwtAuth(user.id);
  res.setHeader("Set-Cookie", `SESSION=${jwtToken}; HttpOnly; Path=/;`);
  return res.status(200).json({ errors });
}
