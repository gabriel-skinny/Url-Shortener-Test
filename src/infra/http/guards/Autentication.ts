import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AbstractAuthService } from 'src/application/services/jwt';
import { ConditionalGuardByBearer } from '../decoretors/conditionalGuard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AbstractAuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const conditionalGuardByBearer = this.reflector.get(
      ConditionalGuardByBearer,
      context.getHandler(),
    );

    if (conditionalGuardByBearer && !request.headers.authorization) return true;

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.authService.verifyToken(token);

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
