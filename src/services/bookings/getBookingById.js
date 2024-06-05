import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getBookingById = async (id) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    return booking;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default getBookingById;
