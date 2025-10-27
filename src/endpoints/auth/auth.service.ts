import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ValidateSessionDTO } from './dtos/validate-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Buscar usuario activo por username
    const user = await this.userRepository.findOne({
      where: { username, inactive: false },
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
    const payload = {
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    // Generar token
    const token = this.jwtService.sign(payload);
    const refresh = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH'),
      expiresIn: '7d',
    });

    return {
      session: token,
      refreshToken: refresh,
      name: user.name,
      isAdmin: user.isAdmin,
      expiresIn: '1h',
    };
  }

  async validateSession(validateSessionDTO: ValidateSessionDTO) {
    try {
      const { accessToken: authToken, refreshToken } = validateSessionDTO;

      // Intentar verificar el access token
      try {
        const decoded = this.jwtService.verify(authToken);

        // Si el token es válido, devolver la información del usuario
        return {
          valid: true,
          user: {
            id: decoded.sub,
            username: decoded.username,
            isAdmin: decoded.isAdmin,
          },
          requiresRefresh: false,
        };
      } catch (accessError) {
        // Si el access token expiró, intentar usar el refresh token
        if (accessError.name === 'TokenExpiredError') {
          try {
            // Verificar el refresh token con su secret específico
            const refreshDecoded = this.jwtService.verify(refreshToken, {
              secret: this.configService.get<string>('JWT_REFRESH'),
            });

            // Buscar el usuario en la base de datos para asegurarse que sigue activo
            const user = await this.userRepository.findOne({
              where: { id: refreshDecoded.sub, inactive: false },
            });

            if (!user) {
              throw new UnauthorizedException(
                'Usuario no encontrado o inactivo',
              );
            }

            // Crear nuevo payload
            const payload = {
              sub: user.id,
              username: user.username,
              isAdmin: user.isAdmin,
            };

            // Generar NUEVOS tokens (rotación)
            const newAccessToken = this.jwtService.sign(payload);
            const newRefreshToken = this.jwtService.sign(payload, {
              secret: this.configService.get<string>('JWT_REFRESH'),
              expiresIn: '7d',
            });

            return {
              valid: true,
              requiresRefresh: true,
              session: newAccessToken,
              refreshToken: newRefreshToken,
              user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
                name: user.name,
              },
              expiresIn: '1h',
            };
          } catch (refreshError) {
            // El refresh token también expiró o es inválido
            throw new UnauthorizedException(
              'Sesión expirada. Por favor, inicia sesión nuevamente',
            );
          }
        }

        // Si el error no es de expiración, el token es inválido
        throw new UnauthorizedException('Token inválido');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error al validar sesión');
    }
  }
}
