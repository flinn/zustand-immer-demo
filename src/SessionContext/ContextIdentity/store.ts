import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../../Utilities/create-selectors'
import { v4 as uuid } from 'uuid'

export type SessionIdentityState = {
  appSessionId: string | null
  anonymousId: string | null
  externalDeviceSessionId: string | null
  externalUserId: string | null
}

export type SessionIdentityActions = {
  setAppSessionId: () => void
  setAnonymousId: (anonymousId: string) => void
  setExternalDeviceSessionId: (externalDeviceSessionId: string) => void
  setExternalUserId: (externalUserId: string) => void
  resetSessionIdentity: () => void
}

export const useSessionIdentityStoreBase = create<SessionIdentityState & SessionIdentityActions>()(
  immer(set => ({
    appSessionId: null,
    anonymousId: null,
    externalDeviceSessionId: null,
    externalUserId: null,
    setAppSessionId: () => {
      set((state) => {
        state.appSessionId = uuid()
      })
    },
    setAnonymousId: () => {
      set((state) => {
        state.anonymousId = uuid()
      })
    },
    setExternalDeviceSessionId: (externalDeviceSessionId: string) => {
      set((state) => {
        state.externalDeviceSessionId = externalDeviceSessionId
      })
    },
    setExternalUserId: (externalUserId: string) => {
      set((state) => {
        state.externalUserId = externalUserId
      })
    },
    resetSessionIdentity: () => {
      set((state) => {
        state.appSessionId = uuid()
        state.anonymousId = uuid()
        state.externalDeviceSessionId = null
        state.externalUserId = null
      })
    },
  })))

export const useSessionContextIdentityStore = createSelectors(useSessionIdentityStoreBase)
