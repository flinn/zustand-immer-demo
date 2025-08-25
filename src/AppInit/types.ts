// Enum for AppInit Stages
export enum AppInitStage {
  PROCESS_STARTED = 'PROCESS_STARTED',
  SESSION_SPAWNED = 'SESSION_SPAWNED',
  CONFIGS_LOADED = 'CONFIGS_LOADED',
  CLIENTS_INITIALIZED = 'CLIENTS_INITIALIZED',
  CONTEXTS_IDENTIFIED = 'CONTEXTS_IDENTIFIED',
  USER_INTERFACE_DISPLAYED = 'USER_INTERFACE_DISPLAYED',
  PROCESS_COMPLETED = 'PROCESS_COMPLETED',
}

export enum AppInitVendorActions {
  LOAD_CONFIG = 'LOAD_CONFIG',
  INITIALIZE_CLIENT = 'INITIALIZE_CLIENT',
  RUN_AFTER_CLIENT_INITIALIZATION = 'RUN_AFTER_CLIENT_INITIALIZATION',
  RUN_BEFORE_CONTEXT_IDENTIFICATION = 'RUN_AFTER_CONTEXT_IDENTIFICATION',
  RUN_BEFORE_USER_INTERFACE_DISPALYED = 'RUN_BEFORE_USER_INTERFACE_DISPALYED',
  BEFORE_APPINIT_PROCESS_COMPLETED = 'BEFORE_APPINIT_PROCESS_COMPLETED',
}

export const AppInitStageProgression: Record<AppInitStage, { description: string, percent: number }> = {
  PROCESS_STARTED: { description: 'AppInit Process Started', percent: 0 },
  SESSION_SPAWNED: { description: 'AppInit Session Spawned', percent: 20 },
  CONFIGS_LOADED: { description: 'AppInit Configs Loaded', percent: 30 },
  CLIENTS_INITIALIZED: { description: 'AppInit Clients Initialized', percent: 50 },
  CONTEXTS_IDENTIFIED: { description: 'AppInit Contexts Identified', percent: 70 },
  USER_INTERFACE_DISPLAYED: { description: 'AppInit Runtime Vendor Use Enabled', percent: 90 },
  PROCESS_COMPLETED: { description: 'AppInit Process Completed', percent: 100 },
}

export type VendorInitActionsMap = {
  vendorName: string
  actions: Partial<Record<AppInitVendorActions, Function>>
}

// Enum for Session Startup Types
export enum SessionStartupType {
  COLD_START = 'COLD_START',
  WARM_START = 'WARM_START',
  DEEP_LINK = 'DEEP_LINK',
}
