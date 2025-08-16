import { AppInitStage } from '../../AppInit/types'
import { useAppInitStore } from '../../AppInit'
import { useEffect } from 'react'
import { SessionIdentityState, useSessionContextIdentityStore } from './store'

export const useSessionContextIdentity = (): SessionIdentityState => {
  const appSessionId = useSessionContextIdentityStore.use.appSessionId()
  const anonymousId = useSessionContextIdentityStore.use.anonymousId()
  const externalDeviceSessionId = useSessionContextIdentityStore.use.externalDeviceSessionId()
  const externalUserId = useSessionContextIdentityStore.use.externalUserId()
  const currentInitStage = useAppInitStore.use.currentStage()

  const setAppSessionId = useSessionContextIdentityStore(state => state.setAppSessionId)

  useEffect(() => {
    if (currentInitStage === AppInitStage.APP_CAME_TO_FOREGROUND) {
      setAppSessionId()
    }
  }, [currentInitStage])

  return {
    appSessionId,
    anonymousId,
    externalDeviceSessionId,
    externalUserId,
  }
}
