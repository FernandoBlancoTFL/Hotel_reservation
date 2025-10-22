import { Request, Response } from 'express';
import { RegisterUser } from '@hotel/domain/src/use-cases/auth/RegisterUser';
import { LoginUser } from '@hotel/domain/src/use-cases/auth/LoginUser';
import { IUserRepository } from '@hotel/domain/src/repositories/IUserRepository';
import { UserRole } from '@hotel/domain/src/entities/User';

export class AuthController {
  constructor(private userRepository: IUserRepository) {}

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone, documentId, role } = req.body;

      if (!email || !password || !name || !phone || !documentId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const registerUser = new RegisterUser(this.userRepository);
      const result = await registerUser.execute({
        email,
        password,
        name,
        phone,
        documentId,
        role: role || UserRole.GUEST
      });

      res.status(201).json({
        user: {
          id: result.user.id,
          email: result.user.email.value,
          name: result.user.name,
          role: result.user.role
        },
        token: result.token
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const loginUser = new LoginUser(this.userRepository);
      const result = await loginUser.execute({ email, password });

      res.status(200).json({
        user: {
          id: result.user.id,
          email: result.user.email.value,
          name: result.user.name,
          role: result.user.role
        },
        token: result.token
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}