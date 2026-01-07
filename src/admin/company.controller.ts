// src/admin/company.controller.ts
import {
  Controller,
  Patch,
  Param,
} from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('admin/companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.companyService.approveCompany(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.companyService.rejectCompany(id);
  }
}
