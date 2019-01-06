import {
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
import { CompaniesAction, CompaniesActionUnion } from './companies.actions';
import { CompanyModel } from '../../models/companies.model';

export interface CompaniesState {
  companies: CompanyState[];
}

export interface CompanyState {
  loaded: boolean;
  loading: boolean;
  data: CompanyModel[];
}


const initialState: CompanyState = {
  loaded: false,
  loading: false,
  data: []
};

export function reducer(state = initialState, action: CompaniesActionUnion): CompanyState {
  switch (action.type) {
    case CompaniesAction.Load: {
      return {
        ...state,
        loading: true,
      };
    }

    case CompaniesAction.LoadSuccess: {
      return {
        ...state,
        loaded: true,
        loading: false,
        data: action.payload,
      };
    }
  }
}

export const getLoadedState = (state: CompanyState) => state.loaded;

export const getLoadingState = (state: CompanyState) => state.loading;

export const getCompaniesState = (state: CompanyState) => state.data;

export const getListState = createFeatureSelector<CompaniesState, CompanyState>('companies');

export const selectCompanies = createSelector(getListState, getCompaniesState);
