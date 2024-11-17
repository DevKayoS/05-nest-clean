import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { makeAnswerAttachments } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit an answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswerRepository.create(answer)

    await inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachments({
        answerId: answer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachments({
        answerId: answer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryAnswerRepository.items[0]).toEqual(
      expect.objectContaining({ content: 'new content' }),
    )
    expect(
      inMemoryAnswerRepository.items[0].attachment.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0].attachment.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to delete a answer from another user', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswerRepository.create(answer)
    await inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachments({
        answerId: answer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachments({
        answerId: answer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
