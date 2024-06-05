import { PrismaClient } from '@prisma/client';

const deleteAmenityById = async (id) => {
  const prisma = new PrismaClient();
  const amenities = await prisma.amenity.deleteMany({
    where: { id },
  });

  return amenities.count > 0 ? id : null;
};

export default deleteAmenityById;
