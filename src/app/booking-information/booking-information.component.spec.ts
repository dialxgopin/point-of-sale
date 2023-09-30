import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInformationComponent } from './booking-information.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('BookingInformationComponent', () => {
  let component: BookingInformationComponent;
  let fixture: ComponentFixture<BookingInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingInformationComponent, DataTableComponent],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(BookingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
