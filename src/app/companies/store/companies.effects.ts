import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { defer, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, toArray } from 'rxjs/operators';

import { CompaniesService } from '../../services/companies.service';
import { CompanyModel } from '../../models/companies.model';
import {
  CompaniesAction,
  LoadSuccess,
  LoadFail
} from './companies.actions';

@Injectable()
export class CompaniesEffects {

  constructor (
    private actions$: Actions,
    private companiesService: CompaniesService
  ) {}

  @Effect()
  loadList$: Observable<Action> = this.actions$.pipe(
    ofType(CompaniesAction.Load),
    switchMap(() => this.companiesService.getList()
      .pipe(
        map((companies: Array<CompanyModel>) => new LoadSuccess(companies)),
        catchError(error => of(new LoadFail(error)))
      )
    )
  );


  // @Effect()
  // addBookToCollection$: Observable<Action> = this.actions$.pipe(
  //   ofType<AddBook>(CollectionActionTypes.AddBook),
  //   map(action => action.payload),
  //   mergeMap(book =>
  //     this.db.insert('books', [book]).pipe(
  //       map(() => new AddBookSuccess(book)),
  //       catchError(() => of(new AddBookFail(book)))
  //     )
  //   )
  // );

  // @Effect()
  // removeBookFromCollection$: Observable<Action> = this.actions$.pipe(
  //   ofType<RemoveBook>(CollectionActionTypes.RemoveBook),
  //   map(action => action.payload),
  //   mergeMap(book =>
  //     this.db.executeWrite('books', 'delete', [book.id]).pipe(
  //       map(() => new RemoveBookSuccess(book)),
  //       catchError(() => of(new RemoveBookFail(book)))
  //     )
  //   )
  // );

  // constructor(private actions$: Actions, private db: Database) {}
}
