import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';



@Injectable()
export class CompanyActiveGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User not active');
    }

    if (!user.company || user.company.status !== 'ACTIVE') {
      throw new ForbiddenException('Company not approved');
    }

    return true;
  }
}
