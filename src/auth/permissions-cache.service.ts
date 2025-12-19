// // src/auth/permissions-cache.service.ts
// import { Inject, Injectable } from '@nestjs/common';
// import Redis from 'ioredis';

// @Injectable()
// export class PermissionsCacheService {
//   constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

//   async setUserPermissions(userId: number, permissions: string[], ttl = 3600) {
//     await this.redis.set(`user:${userId}:permissions`, JSON.stringify(permissions), 'EX', ttl);
//   }

//   async getUserPermissions(userId: number): Promise<string[] | null> {
//     const cached = await this.redis.get(`user:${userId}:permissions`);
//     return cached ? JSON.parse(cached) : null;
//   }

//   async deleteUserPermissions(userId: number) {
//     await this.redis.del(`user:${userId}:permissions`);
//   }
// }


// src/auth/permissions-cache.service.ts
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PermissionsCacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setUserPermissions(userId: number, permissions: string[], ttl = 3600) {
    await this.redis.set(
      `user:${userId}:permissions`,
      JSON.stringify(permissions),
      'EX',
      ttl,
    );
  }

  async getUserPermissions(userId: number): Promise<string[] | null> {
    const cached = await this.redis.get(`user:${userId}:permissions`);
    return cached ? JSON.parse(cached) : null;
  }

  async deleteUserPermissions(userId: number) {
    await this.redis.del(`user:${userId}:permissions`);
  }
}
