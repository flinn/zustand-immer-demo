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
  
  const currentStage = useAppInitStore.use.current()

  const startAppInit = useAppInitStore(state => state.startAppInit)
  const setStartType = useAppInitStore(state => state.setSessionStartupType)
  const setIsFirstAppLaunch = useAppInitStore(state => state.setIsFirstAppLaunch)

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
