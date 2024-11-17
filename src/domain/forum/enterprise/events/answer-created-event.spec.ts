import { DomainEvents } from 'src/core/events/domain-events'
import { AnswerCreatedEvent } from './answer-created-event'
import { Answer } from '../entities/answer'
import { makeAnswer } from 'test/factories/make-answer'

describe('domain events', () => {
  it.skip('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // subscriber cadastrado(ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, AnswerCreatedEvent.name)
    const answer = makeAnswer()
    // Estou criando uma resposta porem SEM salvar no banco
    const aggregate = Answer.create(answer)

    // Estou a segurando que evento foi criado, porem NAO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // salvando a resposta no banco de dados e disparando o eventop
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
