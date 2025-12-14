import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto} from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('auth')
export class AuthController{
    constructor( private authService:AuthService){}

    @Post('register')
    register(@Body() dto: CreateUserDto){
        return this.authService.register(dto)
    }


    @Post("login")
    login(@Body() dto: LoginUserDto){
        return this.authService.login(dto)
    }


    @Post("logout")
    logout(){
        return this.authService.logout()
    }
}

