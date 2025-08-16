import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AppInitStage, SessionStartupType } from './types'
import { createSelectors } from '../Utilities/create-selectors'

export interface AppInitState {
  currentStage: AppInitStage
  isFirsttimeAppLaunch: boolean | null
  sessionStartupType: SessionStartupType | null
  vendorCallbackMap: Record<AppInitStage, Function[]>
}
export type AppInitActions = {
  startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => void
  addVendorStageCallbacks: (vendorCallbacks: Record<AppInitStage, Function>) => void
}

export const useAppInitStoreBase = create<AppInitState & AppInitActions>()(
  immer(set => ({
    currentStage: AppInitStage.INITIAL_STARTUP,
    isFirsttimeAppLaunch: null,
    sessionStartupType: null,
    vendorCallbackMap: {} as any,
    startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => {
      set((state) => {
        state.currentStage = AppInitStage.APP_CAME_TO_FOREGROUND
        state.isFirsttimeAppLaunch = isFirstLaunch
        state.sessionStartupType = startType
      })
    },
    addVendorStageCallbacks: (vendorCallbacks: Record<AppInitStage, Function>) => {
      set((state) => {
        for (const [stage, cbFunction] of Object.entries(vendorCallbacks)) {
          if (state.vendorCallbackMap[stage as AppInitStage]) {
            state.vendorCallbackMap[stage as AppInitStage].push(cbFunction)
          }
          else {
            state.vendorCallbackMap[stage as AppInitStage] = [cbFunction]
          }
        }
      })
    },
  })))

export const useAppInitStore = createSelectors(useAppInitStoreBase)
