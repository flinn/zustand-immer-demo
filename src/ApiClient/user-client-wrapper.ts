import { instance } from './axios-instance'

export const getCurrentUser = async () => {
  const response = await instance.get('/users/1')
  return response.data
}

export const getUserList = async () => {
  const response = await instance.get('/users')
  const userList = response.data
  return userList.slice(0, 5)
}
