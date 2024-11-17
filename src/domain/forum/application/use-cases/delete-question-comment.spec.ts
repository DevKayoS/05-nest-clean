import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { DeleteCommentOnQuestionUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteCommentOnQuestionUseCase

describe('DeleteComment on question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteCommentOnQuestionUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to delete comment on question', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })
  it('should not be able to delete another user comment on question', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
