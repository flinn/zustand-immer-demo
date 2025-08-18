import { useAppInitStore } from './store'

export const useAppInitStage = () => {
  const currentStage = useAppInitStore.use.current()

  const registerVendorActions = useAppInitStore(state => state.registerVendorActionsMap)

  return {
    currentStage,
    registerVendorActions,
  }
}

export default useAppInitStage
