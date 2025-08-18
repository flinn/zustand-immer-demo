import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ExperimentFlag, ExperimentFlagState, ExperimentFlagActions } from './types'
import { createSelectors } from '../Utilities/create-selectors'

export const useExperimentFlagsStoreBase = create<ExperimentFlagState & ExperimentFlagActions>()(
  immer((set, get) => ({
    isAppInitComplete: false,
    isSessionSyncComplete: false,
    cache: {},
    resetFlagCache: () => {
      set((state) => {
        state.cache = {}
      })
    },
    addFlagToCache: (flag: ExperimentFlag) => {
      set((state) => {
        state.cache[flag.name] = flag
      })
    },
    addFlagsToCache: (flags: ExperimentFlag[]) => {
      set((state) => {
        flags.forEach((flag) => {
          state.cache[flag.name] = flag          
        })
      })
    },
    removeFlagFromCache: (flag: ExperimentFlag) => {
      set((state) => {
        delete state.cache[flag.name]
      })
    },
    removeFlagsFromCache: (flagNames: string[]) => {
      set((state) => {
        flagNames.forEach((flagName) => {
          delete state.cache[flagName]
        })
      })
    },
    getCachedFlag: (flagName: string) => {
      const state = get()
      return state.cache[flagName] || null
    },
    getCachedFlags: (flagNames: string[]) => {
      const state = get()
      return flagNames.map(flagName => state.cache[flagName]).filter(Boolean)
    },
  })))

export const useExperimentFlagsStore = createSelectors(useExperimentFlagsStoreBase)

export const useExperimentFlags = () => {
  const cache = useExperimentFlagsStore.use.cache()
  const isSessionSyncComplete = useExperimentFlagsStore.use.isSessionSyncComplete()
  const isAppInitComplete = useExperimentFlagsStore.use.isAppInitComplete()

  const addFlagToCache = useExperimentFlagsStore(state => state.addFlagToCache)
  const addFlagsToCache = useExperimentFlagsStore(state => state.addFlagsToCache)
  const removeFlagFromCache = useExperimentFlagsStore(state => state.removeFlagFromCache)
  const removeFlagsFromCache = useExperimentFlagsStore(state => state.removeFlagsFromCache)
  const getCachedFlag = useExperimentFlagsStore(state => state.getCachedFlag)
  const getCachedFlags = useExperimentFlagsStore(state => state.getCachedFlags)
  const resetFlagCache = useExperimentFlagsStore(state => state.resetFlagCache)

  const getFlagsByType = (type: 'realtime' | 'sessionSynced' | 'appInit' | 'static') => {
    return Object.values(cache).filter((flag) => {
      switch (type) {
        case 'realtime':
          return flag.isRealtime
        case 'sessionSynced':
          return flag.isSessionSynced
        case 'appInit':
          return flag.isAppInit
        case 'static':
          return flag.isStatic
        default:
          return false
      }
    })
  }

  return {
    cache,
    isSessionSyncComplete,
    isAppInitComplete,
    addFlagToCache,
    addFlagsToCache,
    removeFlagFromCache,
    removeFlagsFromCache,
    getCachedFlag,
    getCachedFlags,
    resetFlagCache,
    getFlagsByType,
  }
}

export default useExperimentFlags
