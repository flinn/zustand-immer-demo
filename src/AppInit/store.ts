import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AppInitStage, AppInitVendorActions, SessionStartupType, VendorInitActionsMap } from './types'
import { createSelectors } from '../Utilities/create-selectors'

export interface AppInitState {
  current: AppInitStage
  isFirsttimeAppLaunch: boolean
  sessionStartupType: SessionStartupType
  vendorActionMaps: Record<AppInitVendorActions, Function[]>
}
export type AppInitActions = {
  startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => void
  registerVendorActionsMap: (actionsMap: VendorInitActionsMap) => void
  setSessionStartupType: (startType: SessionStartupType) => void
  setIsFirstAppLaunch: (isFirstLaunch: boolean) => void
}

export const useAppInitStoreBase = create<AppInitState & AppInitActions>()(
  immer(set => ({
    current: AppInitStage.PROCESS_STARTED,
    isFirsttimeAppLaunch: false,
    sessionStartupType: SessionStartupType.COLD_START,
    vendorActionMaps: {} as any,
    setSessionStartupType: (startType: SessionStartupType) => {
      set((state) => {
        state.sessionStartupType = startType
      })
    },
    setIsFirstAppLaunch: (isFirstLaunch: boolean) => {
      set((state) => {
        state.isFirsttimeAppLaunch = isFirstLaunch
      })
    },
    startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => {
      set((state) => {
        state.current = AppInitStage.SESSION_SPAWNED
        state.isFirsttimeAppLaunch = isFirstLaunch
        state.sessionStartupType = startType
      })
    },
    registerVendorActionsMap: (actionsMap: VendorInitActionsMap) => {
      set((state) => {
        for (const [action, vendorFn] of Object.entries(actionsMap.actions)) {
          if (state.vendorActionMaps[action as AppInitVendorActions]) {
            state.vendorActionMaps[action as AppInitVendorActions].push(vendorFn)
          }
          else {
            state.vendorActionMaps[action as AppInitVendorActions] = [vendorFn]
          }
        }
      })
    },
  })))

export const useAppInitStore = createSelectors(useAppInitStoreBase)
