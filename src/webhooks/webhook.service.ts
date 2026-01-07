import { Injectable, ForbiddenException } from '@nestjs/common';
import { TransactionService } from '../transactions/transaction.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  async processPayment(payload: any, signature: string) {

    // 1️⃣ Verify signature
    if (!this.verifySignature(payload, signature)) {
      throw new ForbiddenException('Invalid signature');
    }

    // 2️⃣ Extract required fields
    const {
      transaction_id,
      amount,
      currency,
      merchant_id,
      status,
    } = payload;

    if (status !== 'SUCCESS') {
      return; // ignore failed or pending
    }

    // 3️⃣ Credit PLATFORM wallet first
    await this.transactionService.transfer({
      fromOwnerType: 'EXTERNAL',
      fromOwnerId: 'GATEWAY',
      toOwnerType: 'PLATFORM',
      toOwnerId: 'PLATFORM_MAIN',
      amount,
      currency,
      transactionId: transaction_id,
    });
  }

  private verifySignature(payload: any, signature: string): boolean {
    const secret = process.env.GATEWAY_WEBHOOK_SECRET!;

    const expected = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return expected === signature;
  }

}




await transactionQueue.add(
  'process-payment',
  {
    transactionId,
    amount,
    currency,
  },
  {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
  },
);

