import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BalanceModule } from './Dashboard/balance/balance.module';
import { AuthModule } from './User/auth.module';
@Module({
  imports: [
    BalanceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
