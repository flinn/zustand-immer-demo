import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { AppInitStage, AppInitVendorActions, SessionStartupType, VendorInitActionsMap } from './types'
import { createSelectors } from '../Utilities/create-selectors'

export interface AppInitState {
  currentStage: AppInitStage
  isFirstAppLaunch: boolean
  sessionStartupType: SessionStartupType
  lastStartupTimestamp: string
  vendorActionMaps: Record<AppInitVendorActions, Function[]>
}
export type AppInitActions = {
  startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => void
  registerVendorActionsMap: (actionsMap: VendorInitActionsMap) => void
  setSessionStartupType: (startType: SessionStartupType) => void
  setIsFirstAppLaunch: (isFirstLaunch: boolean) => void
  initializeFirstLaunch: () => void
  clearLocalStorage: () => void
  getLocalStorageInfo: () => { hasData: boolean; dataSize: number; lastStartupTimestamp: string }
}

// Utility function to detect if this is the first time the app is launched
const detectFirstLaunch = (): boolean => {
  console.log(`[DETECT_FIRST_LAUNCH] DETECTING 1ST LAUNCH BY CHECKING LOCAL STORAGE...???`);
  try {
    // Check if we have any stored data
    const stored = localStorage.getItem('app-init-storage')
    console.log(`[DETECT_FIRST_LAUNCH] STORED DATA: ${stored}`);
    if (!stored || JSON.parse(stored)?.state?.lastStartupTimestamp === "N/A") { 
      console.log(`[DETECT_FIRST_LAUNCH] NO STORED DATA --> This is ACTUALLY the 1️⃣ST time the app was launched!!!!!!`);
      return true
    } else {
      console.log(`[DETECT_FIRST_LAUNCH] STORED DATA --> This is ❌NOT❌ the 1st time the app was launched`);
      return false
    }    
  } catch (error) {
    console.warn('Error reading localStorage, defaulting to first launch:', error)
    return true
  }
}

const isFirstTimeAppLaunch = detectFirstLaunch()

export const appInitStoreBase = create<AppInitState & AppInitActions>()(
  persist(
    immer(set => ({
      currentStage: AppInitStage.PROCESS_STARTED,
      isFirstAppLaunch: isFirstTimeAppLaunch, 
      sessionStartupType: SessionStartupType.COLD_START,
      vendorActionMaps: {} as any,
      lastStartupTimestamp: undefined,
      setSessionStartupType: (startType: SessionStartupType) => {
        set((state) => {
          state.sessionStartupType = startType
        })
      },
      setIsFirstAppLaunch: (isFirstLaunch: boolean) => {
        set((state) => {
          state.isFirstAppLaunch = isFirstLaunch
          if (isFirstLaunch) {
            state.lastStartupTimestamp = "N/A"
            localStorage.removeItem('app-init-storage')            
          } else {
            const startupTimestamp = Date.now().toString()
            state.lastStartupTimestamp = startupTimestamp
            localStorage.setItem('app-init-storage', JSON.stringify({
              state: {
                lastStartupTimestamp: startupTimestamp
              },
              version: 0
            }))
          }
        })
      },
      startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => {
        set((state) => {
          state.currentStage = AppInitStage.SESSION_SPAWNED
          state.isFirstAppLaunch = isFirstLaunch
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
      initializeFirstLaunch: () => {
        set((state) => {
          // This will be called when the app first loads
          // The persist middleware will automatically save this to localStorage
          state.isFirstAppLaunch = true
          state.lastStartupTimestamp = Date.now().toString()
        })
      },
      clearLocalStorage: () => {
        try {
          localStorage.removeItem('app-init-storage')
          console.log('🗑️ localStorage cleared')
        } catch (error) {
          console.error('Error clearing localStorage:', error)
        }
      },
      getLocalStorageInfo: () => {
        try {
          const stored = localStorage.getItem('app-init-storage')
          if (!stored) {
            return { hasData: false, dataSize: 0, lastStartupTimestamp: 'N/A' }
          }          
          const dataSize = new Blob([stored]).size
          const lsData = JSON.parse(stored)?.state;
          const lastStartupTimestamp = lsData?.lastStartupTimestamp && lsData?.lastStartupTimestamp !== "N/A"
            ? new Date(parseInt(lsData?.lastStartupTimestamp)).toLocaleString()
            : 'N/A'
          console.log(`⏲️⏲️⏲️[GET_LOCAL_STORAGE_INFO] LAST STARTUP TIMESTAMP: ⏱️${lastStartupTimestamp}⏱️`);
          return {
            hasData: true,
            dataSize,
            lastStartupTimestamp: lastStartupTimestamp
          }
        } catch (error) {
          console.error('Error reading localStorage info:', error)
          return { hasData: false, dataSize: 0, lastStartupTimestamp: 'N/A' }
        }
      },
    })),
    {
      name: 'app-init-storage', // unique name for localStorage key
      partialize: (state) => ({
        lastStartupTimestamp: state.lastStartupTimestamp
      }), // Only persist these fields
      onRehydrateStorage: () => (state) => {
        // Called when the store is rehydrated from localStorage
        if (state && state.lastStartupTimestamp) {
          console.log('📱 App state restored from LS --> Not first launch...', {
            lastStartupTimestamp: state.lastStartupTimestamp,
          })
        } else {
          console.log('📱 App state was not found in LS --> This is the first launch!', {
            lastStartupTimestamp: state.lastStartupTimestamp,
          })
        }
      },
    }
  ))

export const appInitStore = createSelectors(appInitStoreBase)
