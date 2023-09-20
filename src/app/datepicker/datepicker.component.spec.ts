import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
});
