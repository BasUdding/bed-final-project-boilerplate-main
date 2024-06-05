import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import getHosts from '../services/hosts/getHosts.js';
import createHost from '../services/hosts/createHost.js';
import getHostById from '../services/hosts/getHostById.js';
import updateHostById from '../services/hosts/updateHostById.js';
import deleteHostById from '../services/hosts/deleteHostById.js';

import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;
    let hosts;

    if (name) {
      const filters = { name };
      hosts = await prisma.host.findMany({
        where: filters,
      });
    } else {
      hosts = await getHosts();
    }

    res.json(hosts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while getting hosts!');
    next(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe,
    } = req.body;

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !pictureUrl ||
      !aboutMe
    ) {
      return res.status(400).send('Missing required fields');
    }
    const newHost = await createHost(
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe
    );
    res.status(201).json(newHost);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while creating a new host!');
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);

    if (!host) {
      res.status(404).json({ message: `Host with id ${id} not found` });
    } else {
      res.status(200).json(host);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await deleteHostById(id);

    if (host) {
      res.status(200).send({
        message: `Host with id ${id} successfully deleted`,
        host,
      });
    } else {
      res.status(404).json({
        message: `Host with id ${id} not found`,
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
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe,
    } = req.body;
    const host = await updateHostById(id, {
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe,
    });

    if (host) {
      res.status(200).send({
        message: `Host with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Host with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
