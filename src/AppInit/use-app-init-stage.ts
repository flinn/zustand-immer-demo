import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { AppInitStage, SessionStartupType } from "./types";
import { useEffect } from "react";
import { createSelectors } from "../Utilities/create-selectors";

export interface AppInitState {
  currentStage: AppInitStage;
  isFirsttimeAppLaunch: boolean | null;
  sessionStartupType: SessionStartupType | null;
  vendorCallbackMap: Record<AppInitStage, Function[]>; // Maps vendor events to internal actions
}
export type AppInitActions = {
  startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => void;
  addVendorStageCallbacks: (vendorCallbacks: Record<AppInitStage, Function>) => void;
};

export const useAppInitStoreBase = create<AppInitState & AppInitActions>()(
  immer((set) => ({
    currentStage: AppInitStage.INITIAL_STARTUP,
    isFirsttimeAppLaunch: null,
    sessionStartupType: null,
    vendorCallbackMap: {} as Record<AppInitStage, Function[]>,
    startAppInit: (isFirstLaunch: boolean, startType: SessionStartupType) => {
      set((state) => {
        state.currentStage = AppInitStage.APP_CAME_TO_FOREGROUND;
        state.isFirsttimeAppLaunch = isFirstLaunch;
        state.sessionStartupType = startType;
      });
    },
    addVendorStageCallbacks: (vendorCallbacks: Record<AppInitStage, Function>) => {
      set((state) => {
        for (const [stage, cbFunction] of Object.entries(vendorCallbacks)) {
          if (state.vendorCallbackMap[stage as AppInitStage]) {
            state.vendorCallbackMap[stage as AppInitStage].push(cbFunction);
          } else {
            state.vendorCallbackMap[stage as AppInitStage] = [cbFunction];
          }
        }
      });
    },
  })))

export type AppInitStatusProps = {
  isFirstAppLaunch: boolean;
  startType: SessionStartupType;
}

export const useAppInitStore = createSelectors(useAppInitStoreBase);

export const trackAppInitStage = ({
  isFirstAppLaunch,
  startType
}: AppInitStatusProps) => {

  const isFirsttimeAppLaunch = useAppInitStore.use.isFirsttimeAppLaunch();
  const currentStage = useAppInitStore.use.currentStage();
  const sessionStartupType = useAppInitStore.use.sessionStartupType();
  const vendorCallbackMap = useAppInitStore.use.vendorCallbackMap();

  const startAppInit = useAppInitStore((state) => state.startAppInit);

  useEffect(() => {
    if (currentStage === AppInitStage.APP_CAME_TO_FOREGROUND) {
      startAppInit(isFirstAppLaunch, startType);
    }
  }, [currentStage, isFirstAppLaunch, startType]);

  useEffect(() => {
    if (currentStage === AppInitStage.INITIAL_STARTUP) {
      startAppInit(isFirstAppLaunch, startType);
    }
  }, [currentStage, isFirstAppLaunch, startType]);

  return {
    currentStage,
    sessionStartupType,
    vendorCallbackMap,
    isFirsttimeAppLaunch
  };
}

export const useAppInitStage = () => {
  const currentStage = useAppInitStore.use.currentStage();

  const addVendorStageCallbacks = useAppInitStore((state) => state.addVendorStageCallbacks);

  return {
    currentStage,
    addVendorStageCallbacks,
  };
}

export default useAppInitStage;