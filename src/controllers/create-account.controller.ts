import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import {z} from 'zod'


const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
}) 

type CreateACcountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
    //injecao de dependencia
    constructor(private prisma: PrismaService){}

    @Post()
    @HttpCode(201)
    //esse pipe parecido com middleware esta validando os dados e gerando a execption
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateACcountBodySchema){
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