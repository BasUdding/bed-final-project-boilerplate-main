import { PrismaClient } from '@prisma/client';

const getAminities = async () => {
  const prisma = new PrismaClient();
  const amenities = await prisma.amenity.findMany();

  return amenities;
};

export default getAminities;
