// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN')
// @Post(':id/approve')
// approve(@Param('id') id: number) {
//   return this.companyService.approve(+id);
// }




import { Controller, Patch, Param } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('admin/companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.companyService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.companyService.reject(id);
  }
}
