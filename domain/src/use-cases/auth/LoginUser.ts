import { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';
import { Email } from '../../value-objects/Email';
import { AuthService } from '../../services/AuthService';

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUserResult {
  user: User;
  token: string;
}

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginUserDTO): Promise<LoginUserResult> {
    // Create email value object (validates format)
    const email = new Email(data.email);

    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await AuthService.verifyPassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = AuthService.generateToken(user);

    return { user, token };
  }
}