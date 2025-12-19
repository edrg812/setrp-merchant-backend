import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BalanceModule } from './Dashboard/balance/balance.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';

@Module({ 
  imports: [
    BalanceModule,
    AuthModule,
    AdminModule,

     ConfigModule.forRoot({
      isGlobal: true, // 👈 important
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
