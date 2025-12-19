// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';
// import * as bcrypt from 'bcrypt';
// import * as jwt from 'jsonwebtoken';


// @Injectable()
// export class AuthService {
//   constructor(private prisma: PrismaService) {}

//   async register(dto: CreateUserDto) {
//     const hashed = await bcrypt.hash(dto.password, 10);
//     const user = await this.prisma.user.create({
//       data: { ...dto, password: hashed },
//     });

//     const token = this.signToken(user.id, user.email);
//     return { user: { id: user.id, email: user.email, name: user.name }, token };
//   }

//   async login(dto: LoginUserDto) {
//     const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
//     if (!user) throw new UnauthorizedException('Invalid credentials');

//     const valid = await bcrypt.compare(dto.password, user.password);
//     if (!valid) throw new UnauthorizedException('Invalid credentials');

//     const token = this.signToken(user.id, user.email);
//     return { user: { id: user.id, email: user.email, name: user.name }, token };
//   }

//   async logout() {
//     // For JWT, client just deletes the token
//     return { message: 'Logged out successfully' };
//   }

//   private signToken(userId: number, email: string) {
//     return jwt.sign({ sub: userId, email }, process.env.JWT_SECRET || 'secret', {
//       expiresIn: '1d',
//     });
//   }
// }















import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
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

  // ================= REGISTER =================
  async register(dto: CreateUserDto) {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
          name: dto.name,
          role: 'user', // default role
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
        60 * 60 * 24 * 7, // 7 days
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
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

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
  }

  // ================= LOGOUT =================
  async logout(userId: number) {
    await this.cache.del(`refresh:${userId}`);
    return {
      message: 'Logged out successfully',
    };
  }
}
