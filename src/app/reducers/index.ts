import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../environments/environment';

import { storeFreeze } from 'ngrx-store-freeze';

import * as  fromCompanies from '../companies/store/companies.reducer';


export interface State {
  companies: fromCompanies.CompanyState;
}

export const reducers: ActionReducerMap<State> = {
  companies: fromCompanies.reducer
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze]
  : [];
