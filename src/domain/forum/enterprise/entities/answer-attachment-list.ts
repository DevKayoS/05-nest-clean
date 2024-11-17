import { WatchedList } from 'src/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'

export class AnswerAttachamentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
