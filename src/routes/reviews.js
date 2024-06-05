import { Router } from 'express';
import getReviews from '../services/reviews/getReviews.js';
import createReview from '../services/reviews/createReview.js';
import getReviewById from '../services/reviews/getReviewById.js';
import deleteReviewById from '../services/reviews/deleteReviewById.js';

import auth from '../middleware/auth.js';
import updateReviewById from '../services/reviews/updateReviewById.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const reviews = await getReviews();
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while getting reviews!');
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;

    // Check for missing required fields
    const requiredFields = ['userId', 'propertyId', 'rating', 'comment'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const newReview = await createReview(userId, propertyId, rating, comment);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      res.status(404).json({ message: `Review with id ${id} not found` });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await deleteReviewById(id);

    if (review) {
      res.status(200).send({
        message: `Review with id ${id} successfully deleted`,
        review,
      });
    } else {
      res.status(404).json({
        message: `Review with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, propertyId, rating, comment } = req.body;
    const review = await updateReviewById(id, {
      userId,
      propertyId,
      rating,
      comment,
    });

    if (review) {
      res.status(200).send({
        message: `Review with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Review with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
