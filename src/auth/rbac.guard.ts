// // src/auth/rbac.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../auth/permissions.decorator';
import { PermissionsCacheService } from './permissions-cache.service';
import { ForbiddenException } from '@nestjs/common';


@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsCache: PermissionsCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      throw new ForbiddenException('User not authenticated');
    };
console.log('User ID:', user.userId);
console.log('Required Permissions:', requiredPermissions);
    const cachedPermissions =
      await this.permissionsCache.getUserPermissions(user.userId);

    if (!cachedPermissions?.length) {
      throw new ForbiddenException('No permissions found for user');
    };

    return requiredPermissions.every(p =>
      cachedPermissions.includes(p),
    );
  }
}
