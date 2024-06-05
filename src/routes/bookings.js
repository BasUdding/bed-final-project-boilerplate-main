import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import getBookings from '../services/bookings/getBookings.js';
import createBooking from '../services/bookings/createBooking.js';
import getBookingById from '../services/bookings/getBookingById.js';
import updateBookingById from '../services/bookings/updateBookingById.js';
import deleteBookingById from '../services/bookings/deleteBookingById.js';

import auth from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const { userId, propertyId } = req.query;
    let bookings;

    if (userId) {
      const filters = { userId };
      bookings = await prisma.booking.findMany({
        where: filters,
      });
    } else if (propertyId) {
      bookings = await getBookings(null, propertyId);
    } else {
      bookings = await prisma.booking.findMany();
    }

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while getting bookings!');
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    const requiredFields = [
      'userId',
      'propertyId',
      'checkinDate',
      'checkoutDate',
      'numberOfGuests',
      'totalPrice',
      'bookingStatus',
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const newBooking = await createBooking(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );

    res.status(201).json(newBooking);
  } catch (error) {
    if (error.message.includes('Property with id')) {
      res.status(404).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      res.status(404).json({ message: `Booking with id ${id} not found` });
    } else {
      res.status(200).json(booking);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await deleteBookingById(id);

    if (booking) {
      res.status(200).send({
        message: `Booking with id ${id} successfully deleted`,
        booking,
      });
    } else {
      res.status(404).json({
        message: `Booking with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    const booking = await updateBookingById(id, {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    });

    if (booking) {
      res.status(200).send({
        message: `Booking with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Booking with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
