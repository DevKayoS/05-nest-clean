import { ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/accounts')
export class CreateAccountController {
    //injecao de dependencia
    constructor(private prisma: PrismaService){}

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any){

        const {name, email, password} = body

        // validando se ja existe usuario
        const userWithSameEmail = this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(userWithSameEmail) {
            // status code 409
            throw new ConflictException('Usuario ja existe')
        }

        await this.prisma.user.create({
            data : {
            name,
            email, 
            password
        
            }
         }   
        )
    }
}