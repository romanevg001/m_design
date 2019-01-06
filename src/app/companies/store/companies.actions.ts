import { Action } from '@ngrx/store';
import { CompanyModel } from '../../models/companies.model';

export enum CompaniesAction {
  Load = '[Companies] Load',
  LoadSuccess = '[Companies] Load Success',
  LoadFail = '[Companies] Load Fail',
}

export class Load implements Action {
  readonly type = CompaniesAction.Load;
}

export class LoadSuccess implements Action {
  readonly type = CompaniesAction.LoadSuccess;

  constructor(public payload: Array<CompanyModel>) {}
}

export class LoadFail implements Action {
  readonly type = CompaniesAction.LoadFail;

  constructor(public payload: any) {}
}

export type CompaniesActionUnion =
  | Load
  | LoadSuccess
  | LoadFail
;
