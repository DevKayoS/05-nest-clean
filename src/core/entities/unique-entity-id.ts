import { randomUUID } from 'crypto'

export class UniqueEntityId {
  public value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  equals(id: UniqueEntityId) {
    return id.toValue() === this.toValue()
  }
}
