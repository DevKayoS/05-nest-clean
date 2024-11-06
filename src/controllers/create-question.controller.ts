import {  Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";


const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
}) 

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const createQuestionBodyValidation = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard) // fazendo com que a rota precise de autentificacao para ser chamada
export class CreateQuestionController {
    constructor(private prisma: PrismaService){}
    
    @Post()
    @HttpCode(201)
    async handle(
        @Body(createQuestionBodyValidation) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload)
        {
        const { title, content } = body
        
        await this.prisma.question.create({
            data: {
                title,
                content,
                slug: this.convertToSlug(title),
                authorId: user.sub
            }
        })
    }

    private convertToSlug(title: string): string {
        return title
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, ""
        .replace(/\s+/g, "-")
        )
    }
}