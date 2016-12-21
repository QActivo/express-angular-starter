import express from 'express';
import coreRoutes from './core';
import signupRoutes from './signup';
import socialRoutes from './social';
import tasksRoutes from './tasks';
import tokenRoutes from './token';
import usersRoutes from './users';

const router = express.Router(); // eslint-disable-line new-cap

// mount all routes at /
router.use('/', coreRoutes);
router.use('/', signupRoutes);
router.use('/', socialRoutes);
router.use('/', tasksRoutes);
router.use('/', tokenRoutes);
router.use('/', usersRoutes);

export default router;
