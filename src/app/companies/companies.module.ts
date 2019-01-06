import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartModule } from 'angular-highcharts';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/companies.reducer';
import { CompaniesEffects } from './store/companies.effects';
import { ReactiveFormsModule } from '@angular/forms';

import { SmartComponent } from './smart/smart.component';
import { DumbComponent } from './dumb/dumb.component';


const routes: Routes = [
  {path: '', component: SmartComponent},
  {path: 'dump', component: SmartComponent}
];

@NgModule({
  declarations: [
    SmartComponent,
    DumbComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('companies', reducer),
    EffectsModule.forFeature([CompaniesEffects])
  ],
  exports: [RouterModule],
  bootstrap: [SmartComponent]
})
export class CompaniesModule { }
