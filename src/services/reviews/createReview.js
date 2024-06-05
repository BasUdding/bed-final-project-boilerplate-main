import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const createReview = async (userId, propertyId, rating, comment) => {
  const prisma = new PrismaClient();

  try {
    const result = await prisma.review.create({
      data: {
        userId,
        propertyId,
        rating,
        comment,
      },
    });

    return result;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default createReview;
