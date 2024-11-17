import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id)
    return student
  }
}
