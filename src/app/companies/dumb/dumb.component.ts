import { Component, OnInit, Input, Output, OnChanges, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, from, ReplaySubject} from 'rxjs';
import { Chart, Highcharts } from 'angular-highcharts';
import { ItemModel } from '../../models/companies.model';
import { takeUntil, reduce, filter, scan, tap, distinctUntilKeyChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dumb',
  templateUrl: './dumb.component.html',
  styleUrls: ['./dumb.component.scss']
})
export class DumbComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: Array<ItemModel> = [];
  @Output() itemSelected = new EventEmitter();

  protected inputsData$: ReplaySubject<any> = new ReplaySubject(1);
  private killSwitch$ = new Subject();

  dumpForm: FormGroup;
  chart: Chart;
  categoryOptions = [];
  chartSeries = [];
  currentItems: ItemModel[] = [];
  currentItems$: ReplaySubject<ItemModel[]> = new ReplaySubject(1);
  month = 0;
  total = 0;
  isBtnOpenShow = false;

  constructor() {
    this.currentItems$.pipe(takeUntil(this.killSwitch$))
    .subscribe(value => {
      this.currentItems = value;
      this.updateChart();
      this.countMonthTotal();
    })
  }

  ngOnInit() {
    this.inputsData$.pipe(
      takeUntil(this.killSwitch$),
      distinctUntilKeyChanged('items')
    ).subscribe(data => {
      this.initChart();
      this.currentItems$.next(data['items'].currentValue); 
      this.initForm();
      this.initCategorySelect();

    });
  }

  ngOnDestroy() {
    this.killSwitch$.next();
    this.killSwitch$.complete();
  }

  initCategorySelect() {
    from(this.items).pipe(
      takeUntil(this.killSwitch$),
      reduce((items: string[], item: ItemModel) => {
        if (Object.values(items).indexOf(item.category) === -1) {items.push(item.category); }
        return items;
      }, [])
    ).subscribe(_data =>  this.categoryOptions = _data);
  }

  initForm() {
    const category = new FormControl('');
    category.valueChanges.subscribe(value => {
      company.setValue('All');
      this.isBtnOpenShow = false;

      if(value == 'All') {
        this.currentItems$.next(this.items); 
        return;
      }
      from(this.items).pipe(
        filter(item => item.category === value),
        scan((items: ItemModel[], item: ItemModel) => [...items, item], [])
      ).subscribe(_items => {
        this.currentItems$.next(_items);
      });
    });

    const company = new FormControl('');
    company.valueChanges.subscribe(value => {

      if(value == 'All') {
        this.currentItems$.next(this.items); 
        return;
      }
      let item = this.items.find(item => item.id == value.id);
      this.currentItems$.next(item ? [item] : []);
      if(item) this.isBtnOpenShow = true;
    });

    this.dumpForm = new FormGroup({
      category: category,
      company: company
    });

  }

  ngOnChanges(changes) {
    if ('items' in changes) {
      this.inputsData$.next(changes);
    }
  }

  onItemSelected() {
    this.itemSelected.emit(this.currentItems[0]);
  }

  createChartSeries(items: ItemModel[] = this.currentItems): Highcharts.SeriesOptions[] {
    return (items.length > 0) ? 
      items.reduce((_series, serie, i) => {
        _series.push({
          name: serie.name,
          data: Object.values(serie.weekStats)
        });
        return _series;
      }, [])
    : [];
  }

  initChart() {
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Linechart'
      },
      xAxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
      },
      credits: {
        enabled: false
      }
    });
  }

  removeSeries(seriesIndex?) {
    this.chart.ref$.subscribe(chat => {
      if(!chat.series) return;
      if(!seriesIndex) {
        seriesIndex = Array.from(Array(chat.series.length).keys())
      }
      if(seriesIndex && Array.isArray(seriesIndex)) {
        seriesIndex.forEach(_ => {
          this.chart.removeSeries(0)
        });
      } else if(seriesIndex && seriesIndex.typeof(Number)) this.chart.removeSeries(seriesIndex)
    })
  }

  addSeries(newSeries: Highcharts.SeriesOptions[]) {
    if(newSeries && Array.isArray(newSeries)) {
      newSeries.forEach(series => this.chart.addSeries(series))
    }
  }

  updateChart(newItems: ItemModel[] = this.currentItems){
    this.removeSeries();
    this.addSeries(this.createChartSeries(newItems))
  }

  countMonthTotal(){
    this.month = this.total = 0;
    let count = this.currentItems.length
    this.currentItems.forEach(item => {
      this.month += item.monthBalance;
      this.total += item.balance;
    })
    this.month = this.month / count;
    this.total = this.total / count;
  }

}
