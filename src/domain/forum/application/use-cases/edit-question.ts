import { Either, left, right } from 'src/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachaments-repository'
import { QuestionAttachamentList } from '../../enterprise/entities/question-attachment-list'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachment =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachamentList(
      currentQuestionAttachment,
    )

    const questionAttachment = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachment)

    question.title = title
    question.content = content
    question.attachment = questionAttachmentList

    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
