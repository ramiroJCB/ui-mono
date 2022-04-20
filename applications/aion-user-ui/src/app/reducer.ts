import { AppDispatch, RootState } from './store';
import { commonRootReducer } from '@pec/aion-ui-core/combineReducers';
import { traineeCourseCreditsReducer } from 'features/traineeCourseCredits/slice';
import { traineeReducer } from 'features/trainee/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const reducer = {
  ...commonRootReducer,
  trainee: traineeReducer,
  traineeCourseCredits: traineeCourseCreditsReducer
};
