import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from '../../Utilities/create-selectors'
import { v4 as uuid } from 'uuid'
import { ulid } from 'ulid'

export type SessionIdentityState = {
  appSessionId: string | null
  anonymousId: string | null
  externalDeviceSessionId: string | null
  externalUserId: string | null
}

export type SessionIdentityActions = {
  setAppSessionId: () => void
  setAnonymousId: (anonymousId?: string | undefined) => void
  setExternalDeviceSessionId: (externalDeviceSessionId?: string | undefined) => void
  setExternalUserId: (externalUserId: string) => void
  resetSessionIdentity: () => void
}

export const sessionIdentityStoreBase = create<SessionIdentityState & SessionIdentityActions>()(
  immer(set => ({
    appSessionId: null,
    anonymousId: null,
    externalDeviceSessionId: null,
    externalUserId: null,
    setAppSessionId: () => {
      set((state) => {
        state.appSessionId = `ASID_${uuid().slice(0, 24).replace(/-/g, '')}`;
        console.log(`[z] appSessionId == ${state.appSessionId}`);
      })
    },
    setAnonymousId: (anonymousId?: string | undefined) => {
      set((state) => {
        state.anonymousId = anonymousId ?? `ANON_${(uuid().slice(0, 13).replace(/-/g, ''))}`;
        console.log(`[z] anonymousId == ${state.anonymousId}`);
      })
    },
    setExternalDeviceSessionId: (externalDeviceSessionId?: string | undefined) => {
      set((state) => {
        const newExternalDeviceSessionId = externalDeviceSessionId ?? ulid().slice(0, 20).replace(/-/g, '');
        state.externalDeviceSessionId = `DEVICE_${newExternalDeviceSessionId}`;
        console.log(`[z] externalDeviceSessionId == ${state.externalDeviceSessionId}`);
      })
    },
    setExternalUserId: (externalUserId: string) => {
      set((state) => {
        state.externalUserId = externalUserId
        console.log(`[z] externalUserId == ${state.externalUserId}`);
      })
    },
    resetSessionIdentity: () => {
      set((state) => {
        state.appSessionId = uuid()
        state.anonymousId = uuid()
        state.externalDeviceSessionId = null
        state.externalUserId = null
        console.log(`[z] reset SessionIdentity state`);
      })
    },
  })))

export const sessionContextIdentityStore = createSelectors(sessionIdentityStoreBase)
