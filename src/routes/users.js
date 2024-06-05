import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import getUsers from '../services/users/getUsers.js';
import createUser from '../services/users/createUser.js';
import getUserById from '../services/users/getUserById.js';
import updateUserById from '../services/users/updateUserById.js';
import deleteUserById from '../services/users/deleteUserById.js';

import auth from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const { username, email } = req.query;
    let users;

    if (username || email) {
      const filterField = username ? 'username' : 'email';
      const filterValue = username || email;
      users = await prisma.user.findMany({
        where: {
          [filterField]: filterValue,
        },
      });
    } else {
      users = await getUsers();
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { username, password, name, email, phoneNumber, pictureUrl } =
      req.body;

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !pictureUrl
    ) {
      return res.status(400).send('Missing required fields');
    }
    const newUser = await createUser(
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while creating a new user!');
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);

    if (user) {
      res.status(200).send({
        message: `User with id ${id} successfully deleted`,
        user,
      });
    } else {
      res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, password, username, image } = req.body;
    const user = await updateUserById(id, { name, password, username, image });

    if (user) {
      res.status(200).send({
        message: `User with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
