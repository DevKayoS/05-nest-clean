import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '../../prisma/prisma.service'
import { z } from 'zod'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'

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
