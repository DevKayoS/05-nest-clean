import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";


// const createAccountBodySchema = z.object({
//     name: z.string(),
//     email: z.string().email(),
//     password: z.string()
// }) 

// type CreateACcountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/sessions')
export class AuthenticateConroller {
    //injecao de dependencia
    constructor(private jwt: JwtService){}

    @Post()
    //@HttpCode(201)
    //esse pipe parecido com middleware esta validando os dados e gerando a execption
    //@UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(){
        const token = this.jwt.sign({ sub: 'user-id' })

        return token
        
    }
}