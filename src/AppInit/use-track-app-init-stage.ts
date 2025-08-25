import { useEffect } from 'react'
import { appInitStore } from './store'
import { SessionStartupType, AppInitStage } from './types'

export type TrackAppInitStageProps = {
  isFirstAppLaunch: boolean
  startType: SessionStartupType
}

export const useTrackAppInitStage = ({
  isFirstAppLaunch,
  startType,
}: TrackAppInitStageProps) => {
  const currentStage = appInitStore.use.currentStage()

  const startAppInit = appInitStore(state => state.startAppInit)
  const setStartType = appInitStore(state => state.setSessionStartupType)
  const setIsFirstAppLaunch = appInitStore(state => state.setIsFirstAppLaunch)

  useEffect(() => {
    if (currentStage === AppInitStage.PROCESS_STARTED) {
      startAppInit(isFirstAppLaunch, startType)
    }
  }, [currentStage, isFirstAppLaunch, startType, startAppInit])

  return {
    setSessionStartupType: setStartType,
    setIsFirstAppLaunch: setIsFirstAppLaunch,
  }
}
