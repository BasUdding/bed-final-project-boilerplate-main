import { PrismaClient, Prisma } from '@prisma/client';

const createProperty = async (
  title,
  description,
  location,
  pricePerNight,
  bedroomCount,
  bathRoomCount,
  maxGuestCount,
  hostId,
  rating
) => {
  const prisma = new PrismaClient();
  try {
    const newProperty = {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      host: { connect: { id: hostId } },
      rating,
    };

    const property = await prisma.property.create({
      data: newProperty,
    });

    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default createProperty;
