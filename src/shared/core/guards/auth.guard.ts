import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ITokenPayload } from '../../interface/token_payload.interface';
import { CustomForbiddenException, CustomUnauthorizedException } from '../exception/custom-exception';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  logger: Logger = new Logger(LocalAuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new CustomUnauthorizedException();
    }
    try {
      const payload: ITokenPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      // Lấy roles yêu cầu từ decorator
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const userRoles = payload.role || [];
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        throw new CustomForbiddenException(`You do not have permission to access this resource. Required roles: ${requiredRoles.join(', ')}`);
      }
      request['payload'] = payload;
    } catch (error) {
      this.logger.error(error.message);
      throw new CustomUnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.body?.token || request.query.token || request.headers["x-access-token"] || request.headers['authorization']?.replace('Bearer ', '');
    return token;
  }
}