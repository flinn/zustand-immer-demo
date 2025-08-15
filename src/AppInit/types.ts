// Enum for AppInit Stages
export enum AppInitStage {
  INITIAL_STARTUP = 'Initial Startup',
  APP_CAME_TO_FOREGROUND = 'App Came to Foreground',
  VENDOR_CONFIG_PREPARED = 'Vendor Config Prepared',
  VENDOR_SDK_INITIATED = 'Vendor SDKs Initiated',
  VENDOR_CONTEXTS_IDENTIFIED = 'Vendor Contexts Identified',
  RUNTIME_VENDOR_USE_ENABLED = 'Runtime Vendor Use Enabled',
}

// Enum for Session Startup Types
export enum SessionStartupType {
  COLD_START = 'COLD_START',
  WARM_START = 'WARM_START',
  DEEP_LINK = 'DEEP_LINK',
}
