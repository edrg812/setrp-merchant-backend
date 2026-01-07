// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Param,
//   Body,
//   Delete,
// } from '@nestjs/common';
// import { BalanceService } from './balance.service';
// import { CreateBalanceDto } from './dto/create-balance.dto';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
// import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
// import { Permissions } from '../../auth/permissions.decorator';
// import { RbacGuard } from '../../auth/rbac.guard';



// // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
// @Controller('balance')
// @UseGuards(JwtAuthGuard, RbacGuard, )
// export class BalanceController {
//   constructor(private readonly balanceService: BalanceService) {}

//   // CREATE new balance row
//   @Post()
//   create(@Body() dto: CreateBalanceDto) {
//     return this.balanceService.create(dto);
//   }

//   // GET all balances
 
//   @Permissions('balance.read')
//   @Get()
//   findAll() {
//     return this.balanceService.findAll();
//   }

//   // GET balance by currency (BDT or USD)
//   @Get(':currency')
//   findOne(@Param('currency') currency: string) {
//     return this.balanceService.findByCurrency(currency.toUpperCase());
//   }

//   // UPDATE balance by currency
//   @Patch(':currency')
//   update(
//     @Param('currency') currency: string,
//     @Body() dto: Partial<CreateBalanceDto>,
//   ) {
//     return this.balanceService.update(currency.toUpperCase(), dto);
//   }


//   @Delete(':currency')
//   remove(@Param('currency') currency: string) {
//     return this.balanceService.remove(currency.toUpperCase());
//   }
// }








import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RbacGuard } from '../../auth/rbac.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('balance')
@UseGuards(JwtAuthGuard, RbacGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  // ================= CREATE BALANCE =================
  @Permissions('balance.create')
  @Post()
  create(@Req() req, @Body() dto: CreateBalanceDto) {
    const companyId = req.user.company.id;
    return this.balanceService.create(companyId, dto);
  }

  // ================= GET ALL BALANCES =================
  @Permissions('balance.read')
  @Get()
  findAll(@Req() req) {
    // console.log('USER OBJECT:', req.user);

    const companyId = req.user.company.id;
    return this.balanceService.findAll(companyId);
  }

  // ================= GET BY CURRENCY =================
  @Permissions('balance.read')
  @Get(':currency')
  findOne(@Req() req, @Param('currency') currency: string) {
    const companyId = req.user.company.id;
    return this.balanceService.findByCurrency(
      companyId,
      currency.toUpperCase(),
    );
  }

  // ================= UPDATE =================
  @Permissions('balance.update')
  @Patch(':currency')
  update(
    @Req() req,
    @Param('currency') currency: string,
    @Body() dto: Partial<CreateBalanceDto>,
  ) {
    const companyId = req.user.company.id;
    return this.balanceService.update(
      companyId,
      currency.toUpperCase(),
      dto,
    );
  }

  // ================= DELETE =================
  @Permissions('balance.delete')
  @Delete(':currency')
  remove(@Req() req, @Param('currency') currency: string) {
    const companyId = req.user.company.id;
    return this.balanceService.remove(
      companyId,
      currency.toUpperCase(),
    );
  }
}



