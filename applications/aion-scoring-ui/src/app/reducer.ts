import { AppDispatch, RootState } from './store';
import { commonRootReducer } from '@pec/aion-ui-core/combineReducers';
import { contractorsAionScoresReducer } from 'features/compareServiceRegions/contractorsAionScores/slice';
import { contractorsLegacyScoresReducer } from 'features/compareServiceRegions/contractorsLegacyScores/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { scoreItemReducer } from 'features/scoreItems/slice';
import { scoreSetReducer } from 'features/scoreSets/slice';
import { serviceRegionsReducer } from 'features/serviceRegions/slice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const reducer = {
  ...commonRootReducer,
  contractorsAionScores: contractorsAionScoresReducer,
  contractorsLegacyScores: contractorsLegacyScoresReducer,
  serviceRegions: serviceRegionsReducer,
  scoreSet: scoreSetReducer,
  scoreItem: scoreItemReducer
};
