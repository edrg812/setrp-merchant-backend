import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBalanceDto } from './dto/create-balance.dto';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBalanceDto) {
    return this.prisma.balanceOverview.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.balanceOverview.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findByCurrency(currency: string) {
    const item = await this.prisma.balanceOverview.findFirst({
      where: { currency },
    });
    if (!item) throw new NotFoundException('Balance not found');

    return item;
  }

  async update(currency: string, dto: Partial<CreateBalanceDto>) {
    const item = await this.findByCurrency(currency);

    return this.prisma.balanceOverview.update({
      where: { id: item.id },
      data: dto,
    });
  }

  async remove(currency: string) {
    const item = await this.findByCurrency(currency);
    return this.prisma.balanceOverview.delete({
      where: { id: item.id },
    });
  }
}
