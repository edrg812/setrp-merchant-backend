import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma.service';
import { PermissionsCacheService } from '../auth/permissions-cache.service'; // <-- import path
import { RedisModule } from '../redis/redis.module'; // <-- import RedisModule

@Module({
  imports: [RedisModule], // <-- add RedisModule here
  controllers: [AdminController],
  providers: [AdminService, PrismaService, PermissionsCacheService],
})
export class AdminModule {}
