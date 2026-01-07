// @Injectable()
// export class CompanyService {
//   constructor(private prisma: PrismaService) {}

//   async approve(companyId: number) {
//     return this.prisma.company.update({
//       where: { id: companyId },
//       data: { status: 'ACTIVE' },
//     });
//   }
// }




import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  approve(id: string) {
    return this.prisma.company.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date(),
      },
    });
  }

  reject(id: string) {
    return this.prisma.company.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });
  }
}
