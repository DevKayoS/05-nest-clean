import { UniqueEntityId } from './unique-entity-id'

test('it should be able to create a unique id', () => {
  const id = new UniqueEntityId()

  expect(id.value).toEqual(expect.any(String))
})
