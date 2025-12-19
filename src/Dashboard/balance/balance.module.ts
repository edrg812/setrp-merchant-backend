import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { PrismaService } from '../../prisma.service';
import { PermissionsCacheModule } from 'src/auth/permissions-cache.module';

@Module({
  imports: [PermissionsCacheModule], // 👈 REQUIRED

  controllers: [BalanceController],
  providers: [BalanceService, PrismaService],
})
export class BalanceModule {}
