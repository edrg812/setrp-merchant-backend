import { IsNumber, IsString } from 'class-validator';

export class CreateBalanceDto {
  @IsString()
  currency: string;

  @IsNumber()
  totalBalance: number;

  @IsNumber()
  availableBalance: number;

  @IsNumber()
  holdingFunds: number;

  @IsNumber()
  todaysRevenue: number;
}
