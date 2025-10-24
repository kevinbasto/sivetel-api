import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwt: JwtService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    // Obtener el request del contexto HTTP
    const request = context.switchToHttp().getRequest<Request>();
    
    // Obtener los headers
    const authHeader = request.headers['authorization'];
    
    
    // Validar que existe el header de autorización
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }
    
    // Extraer el token (formato: "Bearer <token>")
    const token = this.extractTokenFromHeader(authHeader);
    
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }
    
    
    
    try {
      // Verificar el token
      const payload = this.jwt.verify(token);
    
      
      // Adjuntar el payload al request para usarlo en los controllers
      request['user'] = payload;
      
      return true;
    } catch (error) {
      console.error('Error verificando token:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  
  private extractTokenFromHeader(authHeader: string): string | null {
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}