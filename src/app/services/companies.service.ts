import {Injectable} from '@angular/core';
import {BehaviorSubject, of, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {companies} from './../db/companies.json';
import {CompanyModel} from '../models/companies.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
    protected comparedIdsSbj: BehaviorSubject<CompanyModel[]> = new BehaviorSubject([]);

    constructor() {
    }

    getList(): Observable<CompanyModel[]> {
        return of(companies);
    }
}
