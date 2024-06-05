import { Router } from 'express';

import getAminities from '../services/amenities/getAmenities.js';
import getAmenityById from '../services/amenities/getAmenityById.js';
import createAmenity from '../services/amenities/createAmenity.js';
import updateAmenitygById from '../services/amenities/updateAmenityById.js';
import deleteAmenityById from '../services/amenities/deleteAmenityById.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;

    const amenities = await getAminities(name);
    res.json(amenities);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send('Something went wrong while getting list of amenities!');
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Missing required field: name' });
    }

    const newAmenity = await createAmenity(name);
    res.status(201).json(newAmenity);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityById(id);

    if (!amenity) {
      res.status(404).json({ message: `Amenity with id ${id} not found` });
    } else {
      res.status(200).json(amenity);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await deleteAmenityById(id);

    if (amenity) {
      res.status(200).send({
        message: `Amenity with id ${id} successfully deleted`,
        amenity,
      });
    } else {
      res.status(404).json({
        message: `Amenity with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const amenity = await updateAmenitygById(id, {
      name,
    });

    if (amenity) {
      res.status(200).send({
        message: `Amenity with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Amenity with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
