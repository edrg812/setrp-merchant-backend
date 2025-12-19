import { Module } from '@nestjs/common';
import { PermissionsCacheService } from './permissions-cache.service';

@Module({
  providers: [PermissionsCacheService],
  exports: [PermissionsCacheService], // 👈 VERY IMPORTANT
})
export class PermissionsCacheModule {}
