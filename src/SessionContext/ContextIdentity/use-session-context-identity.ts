import { AppInitStage } from '../../AppInit/types'
import { useAppInitStage } from '../../AppInit'
import { useEffect } from 'react'
import { SessionIdentityState, sessionContextIdentityStore } from './store'

export const useSessionContextIdentity = (): SessionIdentityState => {

  const { currentStage, isFirstAppLaunch } = useAppInitStage()
  
  const appSessionId = sessionContextIdentityStore.use.appSessionId()
  const anonymousId = sessionContextIdentityStore.use.anonymousId()
  const externalDeviceSessionId = sessionContextIdentityStore.use.externalDeviceSessionId()
  const externalUserId = sessionContextIdentityStore.use.externalUserId()
  

  const setAppSessionId = sessionContextIdentityStore(state => state.setAppSessionId)
  const setAnonymousId = sessionContextIdentityStore(state => state.setAnonymousId)
  const setExternalDeviceSessionId = sessionContextIdentityStore(state => state.setExternalDeviceSessionId)

  useEffect(() => {
    if (currentStage === AppInitStage.SESSION_SPAWNED) {
      setAppSessionId()
      if (isFirstAppLaunch) {
        setAnonymousId()
        setExternalDeviceSessionId()
      }
    }
  }, [currentStage, setAppSessionId, isFirstAppLaunch, setAnonymousId, setExternalDeviceSessionId])

  return {
    appSessionId,
    anonymousId,
    externalDeviceSessionId,
    externalUserId,
  }
}
