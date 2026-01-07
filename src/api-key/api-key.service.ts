// import * as crypto from 'crypto';

// async createApiKey(companyId: string, name: string) {
//   const rawKey = crypto.randomBytes(32).toString('hex');
//   const hash = crypto.createHash('sha256').update(rawKey).digest('hex');

//   await this.prisma.apiKey.create({
//     data: {
//       companyId,
//       name,
//       keyHash: hash,
//     },
//   });

//   return { apiKey: rawKey }; // only shown once
// }



import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(companyId: string, name: string) {
    const rawKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');

    await this.prisma.apiKey.create({
      data: {
        companyId,
        name,
        keyHash: hash,
      },
    });

    return { apiKey: rawKey };
  }
}
