import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // ================= PRIVATE TOKEN SIGNER =================
  private async signToken(
    userId: number,
    email: string,
    role?: string,
  ) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      role,
    });
  }

  // ================= REGISTER (BASIC, NON-MERCHANT) =================
  async register(dto: CreateUserDto) {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
          name: dto.name,
          role: 'user',
          status: 'ACTIVE',
          // company: {
          //   connect: { id: companyId },
          // },
        },
      });

      const accessToken = await this.signToken(
        user.id,
        user.email,
        user.role,
      );

      const refreshToken = randomUUID();
      await this.cache.set(
        `refresh:${user.id}`,
        refreshToken,
        60 * 60 * 24 * 7,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }

      this.logger.error(error.message);
      throw new BadRequestException('Registration failed');
    }
  }

  // ================= LOGIN =================
  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        company: true, // ✅ REQUIRED
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account not active');
    }

    if (user.company && user.company.status !== 'ACTIVE') {
      throw new ForbiddenException('Company not approved');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.signToken(
      user.id,
      user.email,
      user.role,
    );

    const refreshToken = randomUUID();
    await this.cache.set(
      `refresh:${user.id}`,
      refreshToken,
      60 * 60 * 24 * 7,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
      accessToken,
      refreshToken,
    };
  }

  // ================= LOGOUT =================
  async logout(userId: number) {
    await this.cache.del(`refresh:${userId}`);
    return { message: 'Logged out successfully' };
  }

  // ================= ACCEPT INVITE =================
  async acceptInvite(token: string, password: string) {
    const invite = await this.prisma.userInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new BadRequestException('Invalid or expired invite');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        password: hashed,
        companyId: invite.companyId,
        status: 'ACTIVE',
      },
    });

    const role = await this.prisma.role.findUnique({
      where: { name: invite.role },
    });

    if (role) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }

    await this.prisma.userInvite.delete({
      where: { id: invite.id },
    });

    return {
      message: 'Account created successfully',
    };
  }
}




