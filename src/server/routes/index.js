import express from 'express';
import coreRoutes from './core';
import tokenRoutes from './token';
import usersRoutes from './users';
import tasksRoutes from './tasks';

const router = express.Router(); // eslint-disable-line new-cap

// mount all routes at /
router.use('/', coreRoutes);
router.use('/', tokenRoutes);
router.use('/', usersRoutes);
router.use('/', tasksRoutes);

export default router;
