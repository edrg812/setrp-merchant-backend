// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
//     });
//   }

//   async validate(payload: any) {
//     return {
//       userId: payload.sub,
//       email: payload.email,
//       roles: payload.roles,
//       permissions: payload.permissions,
//     };
//   }
// }





// // src/auth/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.get<string>('JWT_SECRET')!,
//     });
//   }

//   async validate(payload: any) {
//     // payload.permissions is now available
//     return { userId: payload.sub, email: payload.email, permissions: payload.permissions || [] };
//   }
// }











// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        company: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // 🔐 Block inactive user
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account not active');
    }

    // 🏢 Block unapproved company
    if (user.company &&user.company.status !== 'ACTIVE') {
      throw new ForbiddenException('Company not approved');
    }

    return {
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      company: user.company,
      roles: user.roles.map(r => r.role.name),
      permissions: payload.permissions || [], // optional (Redis / cached perms)
    };
  }
}











