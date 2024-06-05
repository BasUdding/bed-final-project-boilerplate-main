import { PrismaClient } from '@prisma/client';
import notFound from '../../errors/notFound.js';

const deleteReviewById = async (id) => {
  const prisma = new PrismaClient();
  const review = await prisma.review.deleteMany({
    where: { id },
  });

  await prisma.$disconnect();

  if (!review) {
    throw new notFound('Review', id);
  }
  return review.count > 0 ? id : null;
};

export default deleteReviewById;
