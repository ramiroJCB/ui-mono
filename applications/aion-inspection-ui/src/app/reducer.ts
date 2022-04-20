import { answersReducer } from 'features/client/answers/slice';
import { AppDispatch, RootState } from './store';
import { businessUnitsReducer } from 'features/client/businessUnits/slice';
import { commonRootReducer } from '@pec/aion-ui-core/combineReducers';
import { contractorsReducer } from 'features/client/contractors/slice';
import { formsReducer } from 'features/client/forms/slice';
import { inspectionReducer } from 'features/inspection/slice';
import { inspectionSectionsReducer } from 'features/inspectionSections/slice';
import { inspectionsReducer } from 'features/inspections/slice';
import { questionsReducer } from 'features/questions/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const reducer = {
  ...commonRootReducer,
  answers: answersReducer,
  businessUnits: businessUnitsReducer,
  contractors: contractorsReducer,
  forms: formsReducer,
  inspection: inspectionReducer,
  inspections: inspectionsReducer,
  inspectionSections: inspectionSectionsReducer,
  questions: questionsReducer
};
