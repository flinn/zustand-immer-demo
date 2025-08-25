import { appInitStore } from './store'

export const useAppInitStage = () => {
  const isFirstTimeAppLaunch = appInitStore.use.isFirstAppLaunch()
  const currentStage = appInitStore.use.currentStage()
  const startType = appInitStore.use.sessionStartupType()
  const lastStartupTimestamp = appInitStore.use.lastStartupTimestamp()

  const registerVendorActions = appInitStore(state => state.registerVendorActionsMap)

  return {
    currentStage,
    registerVendorActions,
    startType,
    isFirstAppLaunch: Boolean(isFirstTimeAppLaunch || lastStartupTimestamp === "N/A"),
  }
}

export default useAppInitStage
