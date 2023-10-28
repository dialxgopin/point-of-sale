import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateRange } from '../models/date-range';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatepickerComponent],
      imports: [MatDatepickerModule, MatNativeDateModule]
    });
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a selected date when onDateChange is called', () => {
    const selectedDate = new Date('2020-08-31');
    const emitSpy = spyOn(component.dateSelected, 'emit');
    component.onDateChange({ value: selectedDate } as any);
    expect(emitSpy).toHaveBeenCalledWith(selectedDate);
  });

  it('should handle start date change', () => {
    const startDate = new Date(2023, 0, 1);
    const emittedDateRange: DateRange = {
      startDate,
      endDate: component.dateRange.endDate,
    };
    const emitSpy = spyOn(component.dateRangeSelected, 'emit');
    component.onStartDateChange({ value: startDate });
    expect(component.dateRange.startDate).toEqual(startDate);
    expect(emitSpy).toHaveBeenCalledWith(emittedDateRange);
  });

  it('should handle end date change', () => {
    const endDate = new Date(2023, 0, 2);
    const emittedDateRange: DateRange = {
      startDate: component.dateRange.startDate,
      endDate,
    };
    const emitSpy = spyOn(component.dateRangeSelected, 'emit');
    component.onEndDateChange({ value: endDate });
    expect(component.dateRange.endDate).toEqual(endDate);
    expect(emitSpy).toHaveBeenCalledWith(emittedDateRange);
  });
});
