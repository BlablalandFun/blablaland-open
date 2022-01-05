// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import { random } from '../../src/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(400).json({
      error: { message: 'Method not allowed' }
    });
  }

  const username: string = req.body.username;
  if (!username) {
    return res.status(401).json({
      error: { message: 'Missing username' }
    });
  }

  if (username.length < 3 || username.length > 12) {
    return res.status(401).json({
      error: { message: 'Invalid username' }
    });
  }

  const jwt = new SignJWT({
    'username': username,
    'id': random(1, 999999)
  });
  jwt.setProtectedHeader({ alg: 'HS256' });
  jwt.setJti(nanoid());
  jwt.setIssuedAt();
  jwt.setExpirationTime('12h');
  jwt.setSubject('bbl-auth');
  
  const token = await jwt.sign(new TextEncoder().encode('Blablaland.fun'));
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/;`);
  return res.status(200).json({ success: true })
}
