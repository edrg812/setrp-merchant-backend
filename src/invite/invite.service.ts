import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}

  async accept(token: string, password: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { token },
    });

    if (!invite || invite.expiresAt < new Date())
      throw new BadRequestException('Invalid invite');

    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        password: hash,
        companyId: invite.companyId,
        status: 'ACTIVE',
      },
    });

    const role = await this.prisma.role.findUnique({
      where: { name: invite.role },
    });

    if (role) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: role.id },
      });
    }

    await this.prisma.userInvite.delete({ where: { id: invite.id } });
    return user;
  }
}
