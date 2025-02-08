import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionRepository } from "./prisma/repositories/prisma-questions-repository";

@Module({
  providers: [
    PrismaService, 
    PrismaAnswerAttachmentsRepository, 
    PrismaAnswerCommentRepository, 
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionRepository
  ],
  exports: [
    PrismaService,  
    PrismaAnswerAttachmentsRepository, 
    PrismaAnswerCommentRepository, 
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionRepository
  ]
})
export class DataBaseModule {}