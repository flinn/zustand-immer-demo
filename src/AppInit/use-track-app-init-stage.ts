import { useEffect } from 'react'
import { useAppInitStore } from './store'
import { SessionStartupType, AppInitStage } from './types'

export type TrackAppInitStageProps = {
  isFirstAppLaunch: boolean
  startType: SessionStartupType
}

export const useTrackAppInitStage = ({
  isFirstAppLaunch,
  startType,
}: TrackAppInitStageProps) => {
  const isFirsttimeAppLaunch = useAppInitStore.use.isFirsttimeAppLaunch()
  const currentStage = useAppInitStore.use.currentStage()
  const sessionStartupType = useAppInitStore.use.sessionStartupType()
  const vendorCallbackMap = useAppInitStore.use.vendorCallbackMap()

  const startAppInit = useAppInitStore(state => state.startAppInit)

  useEffect(() => {
    if (currentStage === AppInitStage.APP_CAME_TO_FOREGROUND) {
      startAppInit(isFirstAppLaunch, startType)
    }
  }, [currentStage, isFirstAppLaunch, startType, startAppInit])

  useEffect(() => {
    if (currentStage === AppInitStage.INITIAL_STARTUP) {
      startAppInit(isFirstAppLaunch, startType)
    }
  }, [currentStage, isFirstAppLaunch, startType, startAppInit])

  return {
    currentStage,
    sessionStartupType,
    vendorCallbackMap,
    isFirsttimeAppLaunch,
  }
}
