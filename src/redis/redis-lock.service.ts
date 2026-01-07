import { Injectable } from '@nestjs/common';
import { redis } from './redis.provider';

@Injectable()
export class RedisLockService {

  async acquireLock(key: string, ttl = 30000): Promise<boolean> {
    const result = await redis.set(
      key,
      'LOCKED',
      'NX',
      'PX',
      ttl,
    );

    return result === 'OK';
  }

  async releaseLock(key: string) {
    await redis.del(key);
  }
}



