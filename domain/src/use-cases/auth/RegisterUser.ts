import { IUserRepository } from '../../repositories/IUserRepository';
import { User, UserRole } from '../../entities/User';
import { Email } from '../../value-objects/Email';
import { AuthService } from '../../services/AuthService';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
  documentId: string;
  role: UserRole;
}

export interface RegisterUserResult {
  user: User;
  token: string;
}

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO): Promise<RegisterUserResult> {
    // Validate password
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create email value object (validates format)
    const email = new Email(data.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await AuthService.hashPassword(data.password);

    // Create user entity
    const user = new User(
      uuidv4(),
      email,
      passwordHash,
      data.name,
      data.phone,
      data.documentId,
      data.role
    );

    // Save user
    await this.userRepository.save(user);

    // Generate token
    const token = AuthService.generateToken(user);

    return { user, token };
  }
}