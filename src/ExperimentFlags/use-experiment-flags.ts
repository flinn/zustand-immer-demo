import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { ExperimentFlag, ExperimentFlagState, ExperimentFlagActions } from "./types";
import { createSelectors } from "../Utilities/create-selectors";

export const useExperimentFlagsStoreBase = create<ExperimentFlagState & ExperimentFlagActions>()(
  immer((set, get) => ({
    realtimeUpdatedAt: null,
    sessionSyncedUpdatedAt: null,
    appInitUpdatedAt: null,
    cache: {},
    resetFlagCache: () => {
      set((state) => {
        state.cache = {};
        state.realtimeUpdatedAt = null;
        state.sessionSyncedUpdatedAt = null;
        state.appInitUpdatedAt = null;
      });
    },
    addFlagToCache: (flag: ExperimentFlag) => {
      set((state) => {
        state.cache[flag.name] = flag;
        // Update timestamps based on flag type
        if (flag.isRealtime) {
          state.realtimeUpdatedAt = Date.now();
        }
        if (flag.isSessionSynced) {
          state.sessionSyncedUpdatedAt = Date.now();
        }
        if (flag.isAppInit) {
          state.appInitUpdatedAt = Date.now();
        }
      });
    },
    addFlagsToCache: (flags: ExperimentFlag[]) => {
      set((state) => {
        const now = Date.now();
        let hasRealtime = false;
        let hasSessionSynced = false;
        let hasAppInit = false;

        flags.forEach((flag) => {
          state.cache[flag.name] = flag;
          if (flag.isRealtime) hasRealtime = true;
          if (flag.isSessionSynced) hasSessionSynced = true;
          if (flag.isAppInit) hasAppInit = true;
        });

        // Update timestamps based on flag types
        if (hasRealtime) {
          state.realtimeUpdatedAt = now;
        }
        if (hasSessionSynced) {
          state.sessionSyncedUpdatedAt = now;
        }
        if (hasAppInit) {
          state.appInitUpdatedAt = now;
        }
      });
    },
    removeFlagFromCache: (flag: ExperimentFlag) => {
      set((state) => {
        delete state.cache[flag.name];
      });
    },
    removeFlagsFromCache: (flagNames: string[]) => {
      set((state) => {
        flagNames.forEach((flagName) => {
          delete state.cache[flagName];
        });
      });
    },
    getCachedFlag: (flagName: string) => {
      const state = get();
      return state.cache[flagName] || null;
    },
    getCachedFlags: (flagNames: string[]) => {
      const state = get();
      return flagNames.map((flagName) => state.cache[flagName]).filter(Boolean);
    },
  })));

export const useExperimentFlagsStore = createSelectors(useExperimentFlagsStoreBase);

export const useExperimentFlags = () => {
  const cache = useExperimentFlagsStore.use.cache();
  const realtimeUpdatedAt = useExperimentFlagsStore.use.realtimeUpdatedAt();
  const sessionSyncedUpdatedAt = useExperimentFlagsStore.use.sessionSyncedUpdatedAt();
  const appInitUpdatedAt = useExperimentFlagsStore.use.appInitUpdatedAt();

  const addFlagToCache = useExperimentFlagsStore((state) => state.addFlagToCache);
  const addFlagsToCache = useExperimentFlagsStore((state) => state.addFlagsToCache);
  const removeFlagFromCache = useExperimentFlagsStore((state) => state.removeFlagFromCache);
  const removeFlagsFromCache = useExperimentFlagsStore((state) => state.removeFlagsFromCache);
  const getCachedFlag = useExperimentFlagsStore((state) => state.getCachedFlag);
  const getCachedFlags = useExperimentFlagsStore((state) => state.getCachedFlags);
  const resetFlagCache = useExperimentFlagsStore((state) => state.resetFlagCache);

  const getFlagsByType = (type: 'realtime' | 'sessionSynced' | 'appInit' | 'static') => {
    return Object.values(cache).filter((flag) => {
      switch (type) {
        case 'realtime':
          return flag.isRealtime;
        case 'sessionSynced':
          return flag.isSessionSynced;
        case 'appInit':
          return flag.isAppInit;
        case 'static':
          return flag.isStatic;
        default:
          return false;
      }
    });
  };

  return {
    cache,
    realtimeUpdatedAt,
    sessionSyncedUpdatedAt,
    appInitUpdatedAt,
    addFlagToCache,
    addFlagsToCache,
    removeFlagFromCache,
    removeFlagsFromCache,
    getCachedFlag,
    getCachedFlags,
    resetFlagCache,
    getFlagsByType,
  };
};

export default useExperimentFlags;
