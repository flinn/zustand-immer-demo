import { useAppInitStore } from './store'

export const useAppInitStage = () => {
  const currentStage = useAppInitStore.use.currentStage()

  const addVendorStageCallbacks = useAppInitStore(state => state.addVendorStageCallbacks)

  return {
    currentStage,
    addVendorStageCallbacks,
  }
}

export default useAppInitStage
