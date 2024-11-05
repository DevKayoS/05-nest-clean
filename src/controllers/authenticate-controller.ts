import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { verify } from "crypto";
import { NotFoundError } from "rxjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";


const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
}) 

type AuthenticateAccountBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateConroller {
    //injecao de dependencia
    constructor(private jwt: JwtService, private prisma: PrismaService){}

    @Post()
    @HttpCode(200)
    //esse pipe parecido com middleware esta validando os dados e gerando a execption
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateAccountBodySchema){
        const { email, password } = body
        
        const user = await this.prisma.user.findUnique({where: { email}})

        if(!user){
            throw new UnauthorizedException('User credentials do not match')
        }

        const isPasswordValid = await compare(password, user.password)

        if(!isPasswordValid){
            throw new UnauthorizedException('User Credentials do not match')
        }

        
        const accessToken = this.jwt.sign({ sub: user.id })


        return {
            access_token: accessToken
        }
        
    }
}