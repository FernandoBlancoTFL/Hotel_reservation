import { AuthRepository, RegisterDTO } from '../../repositories/AuthRepository';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(data: RegisterDTO) {
    // Validaciones
    if (!data.email || !data.password || !data.name) {
      throw new Error('Todos los campos son requeridos');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Email inválido');
    }

    if (data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return await this.authRepository.register(data);
  }
}