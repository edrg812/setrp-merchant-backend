import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/User/jwt-auth.guard';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  // CREATE new balance row
  @Post()
  create(@Body() dto: CreateBalanceDto) {
    return this.balanceService.create(dto);
  }

  // GET all balances
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.balanceService.findAll();
  }

  // GET balance by currency (BDT or USD)
  @Get(':currency')
  findOne(@Param('currency') currency: string) {
    return this.balanceService.findByCurrency(currency.toUpperCase());
  }

  // UPDATE balance by currency
  @Patch(':currency')
  update(
    @Param('currency') currency: string,
    @Body() dto: Partial<CreateBalanceDto>,
  ) {
    return this.balanceService.update(currency.toUpperCase(), dto);
  }
}






