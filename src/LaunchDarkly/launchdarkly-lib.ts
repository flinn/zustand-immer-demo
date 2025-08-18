import { useEffect, useRef } from 'react'
import { AppInitVendorActions, useAppInitStage } from '../AppInit'
import { LDClient } from './launchdarkly-sdk'

export const useLaunchDarkly = () => {
  const { registerVendorActions } = useAppInitStage()

  const clientRef = useRef<LDClient | null>(null)

  useEffect(() => {
    clientRef.current = LDClient.init()
  }, [])

  const configCallback = () => {
    console.log('[LaunchDarkly] App came to foreground - initializing config')
    // Here you could trigger flag refresh or other LaunchDarkly operations
  }
  registerVendorActions({
    vendorName: 'LaunchDarkly',
    actions: {
      [AppInitVendorActions.LOAD_CONFIG]: configCallback,
    }
  });

  return {
    client: clientRef.current,
    isReady: clientRef.current !== null,
  }
}
