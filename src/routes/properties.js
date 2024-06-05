import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import getProperties from '../services/properties/getProperties.js';
import createProperty from '../services/properties/createProperty.js';
import getPropertyById from '../services/properties/getPropertyById.js';
import updatePropertyById from '../services/properties/updatePropertyById.js';
import deletePropertyById from '../services/properties/deletePropertyById.js';

import auth from '../middleware/auth.js';
import notFound from '../errors/notFound.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const { location, pricePerNight, amenities } = req.query;
    let properties;

    if (location || pricePerNight || amenities) {
      const filters = {};
      if (location) {
        filters.location = location;
      }
      if (pricePerNight) {
        filters.pricePerNight = parseFloat(pricePerNight);
      }
      if (amenities) {
        const amenityNames = amenities.split(',');

        filters.amenities = {
          some: {
            name: {
              in: amenityNames,
            },
          },
        };
      }

      properties = await prisma.property.findMany({
        where: filters,
        include: {
          amenities: true,
        },
      });
    } else {
      properties = await getProperties();
    }

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while getting properties!');
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;

    // Check for missing required fields
    const requiredFields = [
      'title',
      'description',
      'location',
      'pricePerNight',
      'bedroomCount',
      'bathRoomCount',
      'maxGuestCount',
      'hostId',
      'rating',
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const newProperty = await createProperty(
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating
    );

    console.log('newProperty after function:', newProperty);
    res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);

    if (!property) {
      res.status(404).json({ message: `Property with id ${id} not found` });
    } else {
      res.status(200).json(property);
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;
    const property = await updatePropertyById(id, {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    });

    if (property) {
      res.status(200).send({
        message: `Property with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Property with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await deletePropertyById(id);

    if (property) {
      res.status(200).send({
        message: `Property with id ${id} successfully deleted`,
        property,
      });
    } else {
      res.status(404).json({
        message: `Property with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
