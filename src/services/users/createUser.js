import { PrismaClient } from '@prisma/client';

const createUser = async (
  username,
  password,
  name,
  email,
  phoneNumber,
  pictureUrl
) => {
  const newUser = {
    username,
    password,
    name,
    email,
    phoneNumber,
    pictureUrl,
  };

  const prisma = new PrismaClient();
  const user = await prisma.user.create({
    data: newUser,
  });

  return user;
};

export default createUser;
