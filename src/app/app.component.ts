import { Component } from '@angular/core';
import { FiltersService } from './filters.service';
import { DateRange } from './models/date-range';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  reportsTabSelected: boolean = false;

  constructor(private filtersService: FiltersService) { }

  handleDateSelected(selectedDate: Date) {
    this.filtersService.setDate(selectedDate);
    this.filtersService.setDateRange(this.dateOneDayRange(selectedDate));
  }

  private dateOneDayRange(date: Date): DateRange {
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
    return {
      startDate: startDate,
      endDate: endDate
    };
  }

  handleDateRangeSelected(selectedDateRange: DateRange) {
    this.filtersService.setDateRange(selectedDateRange);
    this.filtersService.setDate(selectedDateRange.startDate);
  }

  handleTabSelected(selectedTab: number) {
    this.reportsTabSelected = selectedTab === 6;
  }
}
