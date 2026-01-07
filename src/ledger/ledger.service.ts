// // src/ledger/ledger.service.ts
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';

// @Injectable()
// export class LedgerService {
//   constructor(private prisma: PrismaService) {}

//   async credit(
//     walletId: string,
//     amount: number,
//     referenceTxn: string,
//     tx = this.prisma,
//   ) {
//     const balance = await this.getBalance(walletId, tx);

//     return tx.ledger.create({
//       data: {
//         walletId,
//         credit: amount,
//         debit: 0,
//         balanceAfter: balance + amount,
//         referenceTxn,
//       },
//     });
//   }

//   async debit(
//     walletId: string,
//     amount: number,
//     referenceTxn: string,
//     tx = this.prisma,
//   ) {
//     const balance = await this.getBalance(walletId, tx);

//     if (balance < amount) {
//       throw new Error('Insufficient funds');
//     }

//     return tx.ledger.create({
//       data: {
//         walletId,
//         credit: 0,
//         debit: amount,
//         balanceAfter: balance - amount,
//         referenceTxn,
//       },
//     });
//   }

//   private async getBalance(walletId: string, tx: any): Promise<number> {
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
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async credit(
    walletId: string,
    amount: number,
    referenceTxn: string,
    tx: any,
  ) {
    const balance = await this.getBalance(walletId, tx);

    return tx.ledger.create({
      data: {
        walletId,
        credit: amount,
        debit: 0,
        balanceAfter: balance + amount,
        referenceTxn,
      },
    });
  }

  async debit(
    walletId: string,
    amount: number,
    referenceTxn: string,
    tx: any,
  ) {
    const balance = await this.getBalance(walletId, tx);

    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    return tx.ledger.create({
      data: {
        walletId,
        credit: 0,
        debit: amount,
        balanceAfter: balance - amount,
        referenceTxn,
      },
    });
  }

  async getBalance(walletId: string, tx: any): Promise<number> {
    const result = await tx.ledger.aggregate({
      where: { walletId },
      _sum: {
        credit: true,
        debit: true,
      },
    });

    return (
      Number(result._sum.credit || 0) -
      Number(result._sum.debit || 0)
    );
  }
}
