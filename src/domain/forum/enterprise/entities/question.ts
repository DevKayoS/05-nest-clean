import { AggragateRoot } from 'src/core/entities/aggregate-root'
import { Slug } from './value-objects.ts/slug'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachamentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  content: string
  slug: Slug
  attachment: QuestionAttachamentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggragateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
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

  get isNew(): boolean {
    /**
     * pega a funcao do dayjs e faz a diferenca em DIAS da data atual para a data
     * de criacao do objeto e se for menor que 3 ela e ua pergunta recente
     *
     * se for uma diferenca menor do que 3 dias ira retornar true
     * se for uma diferenca maior do que 3 dias ira retornar false
     */
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    // atualizando o conteudo
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    // caso exista uma melhor respsota a e ela for diferente da que ja existe sera enviado o evento de notificacao
    if (bestAnswerId === undefined) {
      return
    }

    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set attachment(attachments: QuestionAttachamentList) {
    this.props.attachment = attachments
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachment'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachment: props.attachment ?? new QuestionAttachamentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
