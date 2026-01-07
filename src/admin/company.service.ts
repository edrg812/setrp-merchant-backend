// // src/admin/company.service.ts
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';

// @Injectable()
// export class CompanyService {
//   constructor(private readonly prisma: PrismaService) {}

//   approveCompany(companyId: string) {
//     return this.prisma.company.update({
//       where: { id: companyId },
//       data: { status: 'APPROVED' },
//     });
//   }

//   rejectCompany(companyId: string) {
//     return this.prisma.company.update({
//       where: { id: companyId },
//       data: { status: 'REJECTED' },
//     });
//   }
// }






// src/admin/company.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CompanyStatus } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  approveCompany(companyId: string) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.ACTIVE },
    });
  }

  rejectCompany(companyId: string) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.REJECTED },
    });
  }
}
