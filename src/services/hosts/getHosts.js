import { PrismaClient } from '@prisma/client';

const getHosts = async () => {
  const prisma = new PrismaClient();
  const hosts = await prisma.host.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
      aboutMe: true,
    },
  });

  await prisma.$disconnect();
  return hosts;
};

export default getHosts;
