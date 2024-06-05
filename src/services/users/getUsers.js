import { PrismaClient } from '@prisma/client';

const getUsers = async () => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
    },
  });

  await prisma.$disconnect();
  return users;
};

export default getUsers;
