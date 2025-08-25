import { faker } from '@faker-js/faker'
import { AxiosResponse } from 'axios'

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  }
}

export const fakedUsers = (count: number) => faker.helpers.multiple(createRandomUser, {
  count,
})

export const getFakeUsers = (numFakeUsers: number = 5) => {
  return fakedUsers(numFakeUsers)
}

export const fakeUserListResponse = (res: AxiosResponse) => {
  return {
    data: getFakeUsers(),
    status: 200,
    statusText: 'OK',
    headers: {
      ...res.headers,
    },
    config: {
      ...res.config,
    },
    request: {
      ...res.request,
    },
  }
}

export const fakeUserResponse = (res: AxiosResponse) => {
  return {
    data: createRandomUser(),
    status: 200,
    statusText: 'OK',
    headers: {
      ...res.headers,
    },
    config: {
      ...res.config,
    },
    request: {
      ...res.request,
    },
  }
}
