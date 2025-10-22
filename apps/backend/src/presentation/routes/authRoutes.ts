import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { IUserRepository } from '@hotel/domain/src/repositories/IUserRepository';

export const createAuthRoutes = (userRepository: IUserRepository): Router => {
  const router = Router();
  const authController = new AuthController(userRepository);

  router.post('/register', authController.register);
  router.post('/login', authController.login);

  return router;
};