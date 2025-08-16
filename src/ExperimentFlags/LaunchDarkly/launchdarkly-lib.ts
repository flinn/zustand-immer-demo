import { useEffect, useRef } from 'react'
import { AppInitStage, useAppInitStage } from '../../AppInit'
import { LDClient } from './launchdarkly-sdk'

export const useLaunchDarkly = () => {
  const { currentStage, addVendorStageCallbacks } = useAppInitStage()

  const clientRef = useRef<LDClient | null>(null)

  useEffect(() => {
    clientRef.current = LDClient.init()
  }, [])

  const configCallback = () => {
    console.log('[LaunchDarkly] App came to foreground - initializing config')
    // Here you could trigger flag refresh or other LaunchDarkly operations
  }
  addVendorStageCallbacks({
    [AppInitStage.APP_CAME_TO_FOREGROUND]: configCallback,
  } as unknown as Record<AppInitStage, Function>)

  useEffect(() => {
    if (currentStage === AppInitStage.APP_CAME_TO_FOREGROUND && clientRef.current) {
      // Register LaunchDarkly callback for this stage

    }
  }, [currentStage])

  return {
    client: clientRef.current,
    isReady: clientRef.current !== null,
  }
}
