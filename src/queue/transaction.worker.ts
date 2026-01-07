import { Worker } from 'bullmq';
import { redis } from '../redis/redis.provider';
import { TransactionService } from '../transactions/transaction.service';
import { RedisLockService } from '../redis/redis-lock.service';

const transactionService = new TransactionService(/* inject prisma */);
const lockService = new RedisLockService();

new Worker(
  'transactions',
  async job => {

    const lockKey = `lock:txn:${job.data.transactionId}`;

    const locked = await lockService.acquireLock(lockKey);

    if (!locked) {
      return; // Already processing elsewhere
    }

    try {
      await transactionService.credit(
        job.data.userId,
        job.data.amount,
        job.data.transactionId,
      );
    } finally {
      await lockService.releaseLock(lockKey);
    }
  },
  { connection: redis },
);



