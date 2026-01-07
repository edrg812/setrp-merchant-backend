// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../prisma.service';
// import { CreateBalanceDto } from './dto/create-balance.dto';


// @Injectable()
// export class BalanceService {
//   constructor(private prisma: PrismaService) {}

//   create(dto: CreateBalanceDto) {
//     return this.prisma.balanceOverview.create({
//       data: dto,
//     });
//   }



//   findAll() {
//     return this.prisma.balanceOverview.findMany({
//       orderBy: { id: 'asc' },
//     });
//   }

//   async findByCurrency(currency: string) {
//     const item = await this.prisma.balanceOverview.findFirst({
//       where: { currency },
//     });
//     if (!item) throw new NotFoundException('Balance not found');

//     return item;
//   }

//   async update(currency: string, dto: Partial<CreateBalanceDto>) {
//     const item = await this.findByCurrency(currency);

//     return this.prisma.balanceOverview.update({
//       where: { id: item.id },
//       data: dto,
//     });
//   }

//   async remove(currency: string) {
//     const item = await this.findByCurrency(currency);
//     return this.prisma.balanceOverview.delete({
//       where: { id: item.id },
//     });
//   }
// }









import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBalanceDto } from './dto/create-balance.dto';

@Injectable()
export class BalanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ companyId comes from JWT
  create(companyId: string, dto: CreateBalanceDto) {
    return this.prisma.balanceOverview.create({
      data: {
        company: {
          connect: { id: companyId },
        },
        currency: dto.currency,
        totalBalance: dto.totalBalance,
        availableBalance: dto.availableBalance,
        holdingFunds: dto.holdingFunds,
        todaysRevenue: dto.todaysRevenue,
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.balanceOverview.findMany({
      where: { companyId },
      orderBy: { id: 'asc' },
    });
  }

  async findByCurrency(companyId: string, currency: string) {
    const item = await this.prisma.balanceOverview.findUnique({
      where: {
        companyId_currency: {
          companyId,
          currency,
        },
      },
    });

    if (!item) throw new NotFoundException('Balance not found');
    return item;
  }

  async update(
    companyId: string,
    currency: string,
    dto: Partial<CreateBalanceDto>,
  ) {
    return this.prisma.balanceOverview.update({
      where: {
        companyId_currency: {
          companyId,
          currency,
        },
      },
      data: dto,
    });
  }

  async remove(companyId: string, currency: string) {
    return this.prisma.balanceOverview.delete({
      where: {
        companyId_currency: {
          companyId,
          currency,
        },
      },
    });
  }
}






