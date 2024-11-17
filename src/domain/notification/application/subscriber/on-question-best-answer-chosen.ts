import { DomainEvents } from 'src/core/events/domain-events'
import { EventHandler } from 'src/core/events/event-handler'
import { AnswerCreatedEvent } from 'src/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from 'src/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from 'src/domain/forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestANswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que voce enviou em "${question.title.substring(0, 20).concat('...')}"`,
      })
    }
  }
}
