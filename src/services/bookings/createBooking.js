import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const createBooking = async (
  userId,
  propertyId,
  checkinDate,
  checkoutDate,
  numberOfGuests,
  totalPrice,
  bookingStatus
) => {
  const prisma = new PrismaClient();

  try {
    const result = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
    });

    return result;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default createBooking;
