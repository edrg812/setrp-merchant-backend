// // src/wallet/wallet.service.ts
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';

// @Injectable()
// export class WalletService {
//   constructor(private prisma: PrismaService) {}

//   async getOrCreateWallet(
//     ownerType: 'PLATFORM' | 'MERCHANT',
//     ownerId: string,
//     currency: 'BDT' | 'USD',
//     tx = this.prisma,
//   ) {
//     let wallet = await tx.wallet.findUnique({
//       where: {
//         ownerType_ownerId_currency: { ownerType, ownerId, currency },
//       },
//     });

//     if (!wallet) {
//       wallet = await tx.wallet.create({
//         data: { ownerType, ownerId, currency },
//       });
//     }

//     return wallet;
//   }

//   async getBalance(walletId: string, tx = this.prisma): Promise<number> {
//     const last = await tx.ledger.findFirst({
//       where: { walletId },
//       orderBy: { createdAt: 'desc' },
//     });

//     return last ? Number(last.balanceAfter) : 0;
//   }
// }





import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateWallet(
    ownerType: 'PLATFORM' | 'MERCHANT',
    ownerId: string,
    currency: 'BDT' | 'USD',
  ) {
    let wallet = await this.prisma.wallet.findUnique({
      where: {
        ownerType_ownerId_currency: {
          ownerType,
          ownerId,
          currency,
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          ownerType,
          ownerId,
          currency,
          status: 'ACTIVE',
        },
      });
    }

    return wallet;
  }

  async getBalance(walletId: string): Promise<number> {
    const result = await this.prisma.ledger.aggregate({
      where: { walletId },
      _sum: {
        credit: true,
        debit: true,
      },
    });

    const credit = Number(result._sum.credit || 0);
    const debit = Number(result._sum.debit || 0);

    return credit - debit;
  }
}
