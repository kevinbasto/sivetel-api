import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Buscar usuario activo por username
    const user = await this.userRepository.findOne({
      where: { username, inactive: false }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Crear payload para JWT
    const payload = { sub: user.id, username: user.username, isAdmin: user.isAdmin };

    // Generar token
    const token = this.jwtService.sign(payload);

    return {
      session: token,
      name: user.name,
      isAdmin: user.isAdmin,
      expiresIn: '1h'
    };
  }
}
