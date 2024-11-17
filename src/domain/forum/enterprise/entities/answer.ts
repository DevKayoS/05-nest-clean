import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import { AnswerAttachamentList } from './answer-attachment-list'
import { AggragateRoot } from 'src/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachment: AnswerAttachamentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggragateRoot<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get attachment() {
    return this.props.attachment
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    /**
     * basicamente fazendo um resumo da resposta ele vai pegar o conteudo e pegar
     * os primeiros 120 caracteres e no final vai substituir o espaço vazio por ...
     *
     * ex:
     * da pra vc fazer tal coisa no arch linux fazendo bla bla bla bla bla bla bla bla bla e com isso vc pega o hyprland e...
     *
     */
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    // atualizando o conteudo
    this.touch()
  }

  set attachment(attachment: AnswerAttachamentList) {
    this.props.attachment = attachment
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachment'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachment: props.attachment ?? new AnswerAttachamentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
