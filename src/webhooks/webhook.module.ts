import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
// import { TransactionService } from '../transactions/transaction.service';
import { PrismaService } from '../prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { LedgerService } from '../ledger/ledger.service';

@Module({
  controllers: [WebhookController],
  providers: [
    WebhookService,
    // TransactionService,
    WalletService,
    LedgerService,
    PrismaService,
  ],
})
export class WebhookModule {}
