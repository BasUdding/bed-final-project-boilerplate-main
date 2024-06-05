import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const login = async (username, password) => {
  const secretKey = process.env.AUTH_SECRET_KEY || 'my-secret-key';
  console.log('andere tekst');
  const user = await prisma.user.findFirst({
    where: { username, password },
  });

  if (!user) {
    return null;
  }

  const token = jwt.sign({ userId: user.id }, secretKey);

  return token;
};

export default login;
