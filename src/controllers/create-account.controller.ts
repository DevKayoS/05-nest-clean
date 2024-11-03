import { ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/accounts')
export class CreateAccountController {
    //injecao de dependencia
    constructor(private prisma: PrismaService){}

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any){
        console.log(body)

        const {name, email, password} = body

        // validando se ja existe usuario
        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(userWithSameEmail) {
            // status code 409
            throw new ConflictException('User with same e-mail address already exists')
        }

        // criptografando a senha
        const hashedPassword = await hash(password, 8)

        await this.prisma.user.create({
            data : {
            name,
            email, 
            password: hashedPassword
            }
         }   
        )
    }
}