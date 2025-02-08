import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { PrismaService } from '../infra/prisma/prisma.service'
import { z } from 'zod'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const createQuestionBodyValidation = new ZodValidationPipe(
  createQuestionBodySchema,
)

@Controller('/questions')
@UseGuards(JwtAuthGuard) // fazendo com que a rota precise de autentificacao para ser chamada
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(createQuestionBodyValidation) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: this.convertToSlug(title),
        authorId: user.sub,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, ''.replace(/\s+/g, '-'))
  }
}
