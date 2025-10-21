import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    // Obtener el request
    const request = context.switchToHttp().getRequest<Request>();
    
    // Obtener el usuario del request (debe haber sido seteado por AuthGuard)
    const user = request['user'];
    
    // Si no hay usuario, significa que AuthGuard no se ejecutó primero
    if (!user) {
      throw new UnauthorizedException('No authentication token found');
    }
    
    // Verificar si el usuario es administrador
    if (!user.isAdmin) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    
    return true;
  }
}