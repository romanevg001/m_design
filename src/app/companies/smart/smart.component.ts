import { Component, OnInit, OnDestroy } from '@angular/core';

import { ItemModel, CompanyModel } from '../../models/companies.model';
import {ReplaySubject, Subject, BehaviorSubject, from, merge, never} from 'rxjs';
import {takeUntil, filter, map, tap, concatAll, switchMap, scan, distinctUntilKeyChanged} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as CompaniesActions from '../store/companies.actions';
import * as fromCompanies from '../store/companies.reducer';

@Component({
  selector: 'app-smart',
  templateUrl: './smart.component.html',
  styleUrls: ['./smart.component.scss']
})
export class SmartComponent implements OnInit, OnDestroy {
  items: Array<ItemModel>;
  private killSwitch = new Subject();

  constructor(
    private store: Store<fromCompanies.CompaniesState>
  ) {
    this.store.dispatch(new CompaniesActions.Load());

    this.store.pipe(select(fromCompanies.selectCompanies))
    .pipe(
      switchMap(companies => from(companies).pipe(
          filter((company: CompanyModel) => company.monthRevenue > 0),
          map(company => {
            const item = new ItemModel();
            item.id = company.id;
            item.name = company.name;
            item.category = company.type;
            item.weekStats = company.revenuePerWeek;
            item.balance = company.revenue;
            item.monthBalance = company.monthRevenue;
            return item;
          }),
          scan((items: ItemModel[], item: ItemModel) => [...items, item], [])
        )
    )
    ).subscribe(items => {
     this.items = items;
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.killSwitch.next();
    this.killSwitch.complete();
  }

  onItemSelected(item) {
    console.log(item.id);
  }

}
