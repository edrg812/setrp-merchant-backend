import {Module} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { PrismaService } from "src/prisma.service"
import { JwtStrategy } from "./jwt.strategy"

@Module(
    {
        providers: [AuthService,PrismaService, JwtStrategy],
        controllers: [AuthController],
    }
)
export class AuthModule{}