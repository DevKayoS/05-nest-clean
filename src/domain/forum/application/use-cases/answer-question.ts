import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from 'src/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { QuestionAttachamentList } from '../../enterprise/entities/question-attachment-list'
import { AnswerAttachamentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}
type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })
    const answerAttachment = attachmentsIds.map((attachmentsIds) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentsIds),
        answerId: answer.id,
      })
    })

    answer.attachment = new AnswerAttachamentList(answerAttachment)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
