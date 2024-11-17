import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Answer } from '../entities/answer'
import { DomainEvent } from 'src/core/events/domain-event'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id
  }
}
