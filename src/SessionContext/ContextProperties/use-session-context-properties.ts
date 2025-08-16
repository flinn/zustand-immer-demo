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
      // We don't have what we need to set the user context
      setUserContext(null)
    }
  }, [user, anonymousId, externalUserId])

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
      // We don't have what we need to set the device context
      setDeviceContext(null)
    }
  }, [device, externalDeviceSessionId])

  return {
    kind: 'multi',
    user: userContext,
    device: deviceContext,
  }
}
