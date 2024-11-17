import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { DomainEvent } from 'src/core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityId

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question
    this.ocurredAt = new Date()
    this.bestAnswerId = bestAnswerId
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
