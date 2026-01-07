// @Injectable()
// export class ApiKeyGuard implements CanActivate {
//   constructor(private prisma: PrismaService) {}

//   async canActivate(context: ExecutionContext) {
//     const req = context.switchToHttp().getRequest();
//     const apiKey = req.headers['x-api-key'];

//     if (!apiKey) throw new UnauthorizedException('API key missing');

//     const key = await this.prisma.apiKey.findFirst({
//       where: {
//         key: apiKey,
//         status: 'ACTIVE',
//       },
//       include: { company: true },
//     });

//     if (!key || key.company.status !== 'ACTIVE') {
//       throw new UnauthorizedException('Invalid API key');
//     }

//     req.company = key.company;
//     return true;
//   }
// }







import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('API key missing');

    const hash = require('crypto')
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    const key = await this.prisma.apiKey.findFirst({
      where: { keyHash: hash, status: 'ACTIVE' },
      include: { company: true },
    });

    if (!key) throw new UnauthorizedException('Invalid API key');

    req.company = key.company;
    return true;
  }
}
