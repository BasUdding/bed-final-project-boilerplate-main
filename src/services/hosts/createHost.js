import { PrismaClient } from '@prisma/client';

const createHost = async (
  username,
  password,
  name,
  email,
  phoneNumber,
  pictureUrl,
  aboutMe
) => {
  const newHost = {
    username,
    password,
    name,
    email,
    phoneNumber,
    pictureUrl,
    aboutMe,
  };

  const prisma = new PrismaClient();
  const host = await prisma.host.create({
    data: newHost,
  });

  return host;
};

export default createHost;
