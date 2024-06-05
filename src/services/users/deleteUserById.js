import { PrismaClient } from '@prisma/client';
import notFound from '../../errors/notFound.js';

const deleteUserById = async (id) => {
  const prisma = new PrismaClient();

  const user = await prisma.user.deleteMany({
    where: { id },
  });

  if (!user) {
    throw new notFound('User', id);
  }

  return user.count > 0 ? id : null;
};

export default deleteUserById;
