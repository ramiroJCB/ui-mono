import { AppDispatch, RootState } from './store';
import { commonRootReducer } from '@pec/aion-ui-core/combineReducers';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { formsReducer } from 'features/forms/slice';
import { sectionsReducer } from 'features/formSections/slice';
import { elementsReducer } from 'features/formElements/slice';
import { elementOptionsReducer } from 'features/formElementOptions/slice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const reducer = {
  ...commonRootReducer,
  elementOptions: elementOptionsReducer,
  elements: elementsReducer,
  forms: formsReducer,
  sections: sectionsReducer
};
