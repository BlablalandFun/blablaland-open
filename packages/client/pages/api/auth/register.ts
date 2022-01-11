// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcryptjs";

import { prisma } from "@blablaland/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const errors = {};
  const { password, username, confirmPassword } = req.body;

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
    errors["username"] = "Les mots de passe ne correspondent pas";
  } else if (password !== confirmPassword) {
    errors["confirmPassword"] = "Le pseudo doit faire entre 3 et 12 caractères";
  }

  // on vérifie que le pseudo n'est pas déjà pris
  const other = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  if (other) {
    errors["username"] = "Ce pseudo est déjà pris";
  }

  console.log(errors)
  // il y a des erreurs
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const hashedPassword = await bcrypt.hash(password, 7);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log(user);
  return res.status(200).json({ errors });
}
