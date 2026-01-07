import { Queue } from 'bullmq';
import { redis } from '../redis/redis.provider';

export const transactionQueue = new Queue('transactions', {
  connection: redis,
});


