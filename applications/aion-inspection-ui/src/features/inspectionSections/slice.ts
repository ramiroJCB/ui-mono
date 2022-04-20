import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IInspectionSection } from 'interfaces/inspectionSection';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';

const name = 'inspectionSections';

export const fetchInspectionSections = createAsyncThunk(
  `${name}/fetchInspectionSections`,
  async (inspectionId: string) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder()
      .filter(f => f.filterBy('inspectionId', Equals, inspectionId))
      .orderBy(`sectionSortOrder`)
      .toQueryParam();

    const { data } = await axios.get<{ value: IInspectionSection[]; '@odata.count': number }>(
      '/api/inspections/v3.01/inspectionSections',
      {
        params
      }
    );

    return { data: data.value, total: data['@odata.count.count'] };
  },
  { condition: condition(name) }
);

export const inspectionSectionsAdapter = createEntityAdapter<IInspectionSection>({
  selectId: inspectionSection => inspectionSection.sectionId
});

export const inspectionSectionsSelectors = inspectionSectionsAdapter.getSelectors<RootState>(
  state => state.inspectionSections
);

type State = { total: number } & CommonState;

export const initialState = inspectionSectionsAdapter.getInitialState<State>({
  isFetching: false,
  error: null,
  total: 0
});

const inspectionSections = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchInspectionSections.pending, isFetching);
    builder.addCase(fetchInspectionSections.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      inspectionSectionsAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(fetchInspectionSections.rejected, error);
  }
});

export const { reducer: inspectionSectionsReducer } = inspectionSections;
