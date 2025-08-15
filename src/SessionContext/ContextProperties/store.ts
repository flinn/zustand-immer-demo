import { omit } from "lodash";
import { immer } from "zustand/middleware/immer";
import create from "zustand";
import { createSelectors } from "../../Utilities/create-selectors";
import { UserProperties, DeviceProperties } from "../types";

export type SessionPropertiesState = {
  user: UserProperties | null;
  device: DeviceProperties | null;
  userLastUpdatedAt: number | null;
  deviceLastUpdatedAt: number | null;
}

export type SessionPropertiesActions = {
  setUserProperties: (properties: UserProperties) => void;
  setDeviceProperties: (properties: DeviceProperties) => void;
  removeUserProperties: (propNames: string[]) => void;
  removeDeviceProperties: (propNames: string[]) => void;
}

export const useSessionPropertiesStoreBase = create<SessionPropertiesState & SessionPropertiesActions>()(
  immer((set) => ({
    user: null,
    device: null,
    userLastUpdatedAt: null,
    deviceLastUpdatedAt: null,
    setUserProperties: (properties: UserProperties) => {
      set((state) => {
        state.user = properties;
        state.userLastUpdatedAt = Date.now();
      });
    },
    setDeviceProperties: (properties: DeviceProperties) => {
      set((state) => {
        state.device = properties;
        state.deviceLastUpdatedAt = Date.now();
      });
    },
    removeUserProperties: (propNames: string[]) => {
      set((state) => {
        state.user = omit(state.user, propNames) as UserProperties;
        state.userLastUpdatedAt = Date.now();
      });
    },
    removeDeviceProperties: (propNames: string[]) => {
      set((state) => {
        state.device = omit(state.device, propNames) as DeviceProperties;
        state.deviceLastUpdatedAt = Date.now();
      });
    },
  })));


export const useSessionPropertiesStore = createSelectors(useSessionPropertiesStoreBase);