import axios from 'axios'
import { sessionContextIdentityStore } from '../SessionContext/ContextIdentity/store'
import { fakeUserListResponse, fakeUserResponse } from './mock-user-data'

export const getContextIdentity = () => {
  const ctxIdentity = sessionContextIdentityStore.getState()
  return ctxIdentity
}

let hasExternalUserIdBeenSet = false

console.log('hasExternalUserIdBeenSet (initially)?', hasExternalUserIdBeenSet)

sessionContextIdentityStore.subscribe((state, prevState) => {
  if (state.externalUserId !== prevState.externalUserId && state.externalUserId !== null) {
    console.log('externalUserId changed!', state.externalUserId)
    hasExternalUserIdBeenSet = true
  }
})

export const getInstance = () => {
  const axiosClient = axios.create()

  axiosClient.defaults.baseURL = 'https://jsonplaceholder.typicode.com'
  axiosClient.defaults.headers.common['Content-Type'] = 'application/json'
  axiosClient.defaults.headers.common['Accept'] = 'application/json'
  axiosClient.defaults.headers.common['X-App-Session-Id'] = `${getContextIdentity().appSessionId}`
  axiosClient.defaults.headers.common['X-Anonymous-Id'] = `${getContextIdentity().anonymousId}`
  axiosClient.defaults.headers.common['X-External-Device-Session-Id'] = `${getContextIdentity().externalDeviceSessionId}`

  axiosClient.defaults.timeout = 5000

  axiosClient.interceptors.request.use(async (config) => {
    if (hasExternalUserIdBeenSet) {
      const externalUserId = getContextIdentity().externalUserId
      console.log('setting "X-External-User-Id"', externalUserId)
      config.headers['X-External-User-Id'] = externalUserId
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  axiosClient.interceptors.response.use(async (response) => {
    console.log('original response', response)
    let fakeResponse = null
    if (response.config.url.endsWith('/users')) {
      fakeResponse = fakeUserListResponse(response)
    }
    else {
      fakeResponse = fakeUserResponse(response)
    }
    console.log('fake response', fakeResponse)
    return fakeResponse
  }, (error) => {
    return Promise.reject(error)
  })

  return axiosClient
}

const instance = getInstance()

export { instance }

export default instance
