// import {Module } from "@nestjs/common"
// import { AuthService } from "./auth.service"
// import { AuthController } from "./auth.controller"
// import { PrismaService } from "src/prisma.service"
// import { JwtStrategy } from "./jwt.strategy"
// import { JwtModule } from '@nestjs/jwt';

// @Module(
//     {
//         imports: [
//             JwtModule.register({
//             secret: process.env.JWT_SECRET,
//             signOptions: { expiresIn: '1d' },
//             }),
//         ],
        
//         providers: [AuthService,PrismaService, JwtStrategy],
//         controllers: [AuthController],
//     }
// )
// export class AuthModule{}





// import { Module} from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { PrismaService } from 'src/prisma.service';
// import { JwtStrategy } from './jwt.strategy';
// import { JwtModule } from '@nestjs/jwt';
// import { CacheModule } from '@nestjs/cache-manager'; // <-- import CacheModule

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '1d' },
//     }),

//     // 🔥 THIS IS THE MISSING PART
//     CacheModule.register({
//       ttl: 60 * 60 * 24 * 7, // default TTL (7 days)
//       isGlobal: false, // keep it scoped to AuthModule
//     }),
//   ],
//   providers: [AuthService, PrismaService, JwtStrategy],
//   controllers: [AuthController],
//   exports: [AuthService], // optional but recommended
// })
// export class AuthModule {}






import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';
import { PermissionsCacheService } from './permissions-cache.service';
import { RbacGuard } from './rbac.guard';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

    CacheModule.register({
      ttl: 60 * 60 * 24 * 7,
      isGlobal: false,
    }),

    RedisModule, // ✅ REQUIRED
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    PermissionsCacheService, // ✅ SINGLE SOURCE
    RbacGuard,               // ✅
  ],
  exports: [
    AuthService,
    PermissionsCacheService,
    RbacGuard, // ✅ allows other modules to use it
  ],
})
export class AuthModule {}
