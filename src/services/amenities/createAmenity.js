import { PrismaClient } from '@prisma/client';

const createAmenity = async (name) => {
  const prisma = new PrismaClient();
  const newAmenity = {
    name,
  };
  const amenities = await prisma.amenity.create({
    data: newAmenity,
  });

  return amenities;
};
export default createAmenity;
