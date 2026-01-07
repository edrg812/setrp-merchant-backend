import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}

  async inviteUser(companyId: string, email: string, role: string) {
    return this.prisma.userInvite.create({
      data: {
        email,
        role,
        token: randomUUID(),
        companyId,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
  }

  async validateInvite(token: string) {
    return this.prisma.userInvite.findUnique({ where: { token } });
  }

  async consumeInvite(id: number) {
    return this.prisma.userInvite.delete({ where: { id } });
  }
}
