import { useEffect, useRef } from 'react'
import { AppInitVendorActions, useAppInitStage } from '../AppInit'
import { LDClient } from './launchdarkly-sdk'

const {
  LOAD_CONFIG,
  INITIALIZE_CLIENT,
  RUN_AFTER_CLIENT_INITIALIZATION,
  RUN_BEFORE_USER_INTERFACE_DISPALYED,
  BEFORE_APPINIT_PROCESS_COMPLETED,
} = AppInitVendorActions;

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

  const initializeClientCallback = () => {
    console.log('[LaunchDarkly] Initializing client')
    // Here you could trigger flag refresh or other LaunchDarkly operations
  }

  const runAfterClientInitializationCallback = () => {
    console.log('[LaunchDarkly] Running after client initialization')
    // Here you could trigger flag refresh or other LaunchDarkly operations
  }

  const runBeforeUserInterfaceDisplayedCallback = () => {
    console.log('[LaunchDarkly] Running before user interface displayed')
    // Here you could trigger flag refresh or other LaunchDarkly operations
  }

  const beforeAppInitProcessCompletedCallback = () => {
    console.log('[LaunchDarkly] Before app init process completed')
    // Here you could trigger flag refresh or other LaunchDarkly operations
  }

  registerVendorActions({
    vendorName: 'LaunchDarkly',
    actions: {
      [LOAD_CONFIG]: configCallback,
      [INITIALIZE_CLIENT]: initializeClientCallback,
      [RUN_AFTER_CLIENT_INITIALIZATION]: runAfterClientInitializationCallback,
      [RUN_BEFORE_USER_INTERFACE_DISPALYED]: runBeforeUserInterfaceDisplayedCallback,
      [BEFORE_APPINIT_PROCESS_COMPLETED]: beforeAppInitProcessCompletedCallback,
    },
  })

  return {
    client: clientRef.current,
    isReady: clientRef.current !== null,
  }
}
