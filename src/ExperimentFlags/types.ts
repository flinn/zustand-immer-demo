export interface IFlag {
  name: string
  value: boolean | number | string | null
}

export interface ExperimentFlag extends IFlag {
  name: string
  value: boolean | number | string | null
  lastUpdatedAt: number
  isStatic: boolean
  isRealtime: boolean
  isSessionSynced: boolean
  isAppInit: boolean
}

export type ExperimentFlags = Record<string, ExperimentFlag>

export type ExperimentFlagState = {
  isSessionSyncComplete: boolean
  isAppInitComplete: boolean
  cache: Record<string, ExperimentFlag>
}

export type ExperimentFlagActions = {
  resetFlagCache: () => void
  addFlagToCache: (flag: ExperimentFlag) => void
  addFlagsToCache: (flags: ExperimentFlag[]) => void
  removeFlagFromCache: (flag: ExperimentFlag) => void
  removeFlagsFromCache: (flags: string[]) => void
  getCachedFlag: (flag: string) => ExperimentFlag | null
  getCachedFlags: (flags: string[]) => ExperimentFlag[]
}
