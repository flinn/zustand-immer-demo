import { DeviceProperties, UserProperties } from '../types'
import { useSessionContextIdentity } from '../ContextIdentity/use-session-context-identity'
import { useEffect, useState } from 'react'
import { useSessionPropertiesStore } from './store'

export type AppSessionContexts = {
  kind: 'multi'
  user?: UserProperties | null
  device?: DeviceProperties | null
}

export const useSessionContexts = (): AppSessionContexts => {
  const { appSessionId, anonymousId, externalDeviceSessionId, externalUserId } = useSessionContextIdentity()
  const { user, device, userLastUpdatedAt, deviceLastUpdatedAt } = useSessionPropertiesStore()

  const [userContext, setUserContext] = useState<UserProperties | null>(null)
  const [deviceContext, setDeviceContext] = useState<DeviceProperties | null>(null)

  useEffect(() => {
    if (!externalUserId && anonymousId) {
      // This is an anonymous user
      setUserContext({
        ...user,
        key: anonymousId,
        kind: 'user',
        lastUpdatedAt: userLastUpdatedAt,
        appSessionId,
      })
    }
    else if (externalUserId) {
      // This is a logged in user
      setUserContext({
        ...user,
        key: externalUserId,
        kind: 'user',
        lastUpdatedAt: userLastUpdatedAt,
        appSessionId,
      })
    }
    else {
      setUserContext(null)
    }
  }, [user, anonymousId, externalUserId, appSessionId, userLastUpdatedAt])

  useEffect(() => {
    if (externalDeviceSessionId) {
      // This is a device which has an externalDeviceSessionId set
      setDeviceContext({
        ...device,
        key: externalDeviceSessionId,
        kind: 'device',
        lastUpdatedAt: deviceLastUpdatedAt,
        appSessionId,
      })
    }
    else {
      setDeviceContext(null)
    }
  }, [device, externalDeviceSessionId, appSessionId, deviceLastUpdatedAt])

  return {
    kind: 'multi',
    user: userContext,
    device: deviceContext,
  }
}
