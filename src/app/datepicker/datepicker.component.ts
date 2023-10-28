import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateRange } from '../models/date-range';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() dateRangeSelected: EventEmitter<DateRange> = new EventEmitter<DateRange>();
  @Input() showRangeAndHideSingleDatePicker: boolean = false;

  defaultDate = new Date();
  dateRange: DateRange = {
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private filtersService: FiltersService) {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.defaultDate = date;
      }
    );
    this.filtersService.dateRange$.subscribe(
      dates => {
        this.defaultDate = dates.startDate;
      }
    );
  }

  onDateChange(event: any) {
    this.dateSelected.emit(event.value);
  }

  onStartDateChange(event: any) {
    this.dateRange.startDate = event.value;
    this.dateRangeSelected.emit(this.dateRange);
  }

  onEndDateChange(event: any) {
    this.dateRange.endDate = event.value;
    this.dateRangeSelected.emit(this.dateRange);
  }
}
