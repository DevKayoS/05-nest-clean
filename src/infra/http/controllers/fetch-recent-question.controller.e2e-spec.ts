import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '../../database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { resolve } from 'path'
import { AppModule } from '../../app.module'

describe('Fetch recent question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET]/questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'teste123',
      },
    })

    // gerando um token
    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'question 01',
          slug: 'question 01',
          content: 'question contenti',
          authorId: user.id,
        },
        {
          title: 'question 02',
          slug: 'question 02',
          content: 'question contenti',
          authorId: user.id,
        },
        {
          title: 'question 03',
          slug: 'question 03',
          content: 'question contenti',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

      console.log('resposta da api',response.statusCode)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'question 01' }),
        expect.objectContaining({ title: 'question 02' }),
        expect.objectContaining({ title: 'question 03' }),
      ],
    })
    expect(response.body.questions).toHaveLength(3)
  })
})
