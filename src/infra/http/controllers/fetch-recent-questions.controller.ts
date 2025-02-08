import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '../../database/prisma/prisma.service'
import { z } from 'zod'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryValidationPipe = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard) // fazendo com que a rota precise de autentificacao para ser chamada
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryValidationPipe,
  ) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      questions,
    }
  }
}
