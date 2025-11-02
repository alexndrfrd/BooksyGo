import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token de autentificare lipsește');
    }

    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const payload = jwt.verify(token, secret) as any;
      
      // Attach user to request
      request['user'] = {
        userId: payload.userId || payload.sub,
        email: payload.email,
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalid sau expirat');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

