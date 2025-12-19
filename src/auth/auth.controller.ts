// import { Controller, Post, Body } from "@nestjs/common";
// import { AuthService } from "./auth.service";
// import { CreateUserDto} from "./dto/create-user.dto";
// import { LoginUserDto } from "./dto/login-user.dto";
// import { Req } from '@nestjs/common';

// @Controller('auth')
// export class AuthController{
//     constructor( private authService:AuthService){}

//     @Post('register')
//     register(@Body() dto: CreateUserDto){
//         return this.authService.register(dto)
//     }


//     @Post("login")
//     login(@Body() dto: LoginUserDto){
//         return this.authService.login(dto)
//     }


//     // @Post("logout")
//     // logout(){
//     //     return this.authService.logout()
//     // }

    
//     @Post('logout')
//     logout(@Req() req) {
//     return this.authService.logout(req.user.id);
//     }
// }




import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard'; // adjust path if needed
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ================= REGISTER =================
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // ================= LOGIN =================
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  // ================= LOGOUT =================
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request & { user: any }) {
    return this.authService.logout(req.user.id);
  }
}
