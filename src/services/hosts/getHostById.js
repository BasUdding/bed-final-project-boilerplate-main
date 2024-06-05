import { PrismaClient } from '@prisma/client';

const getHostById = async (id) => {
  const prisma = new PrismaClient();
  const hosts = await prisma.host.findUnique({
    where: { id },
  });

  return hosts;
};

export default getHostById;
