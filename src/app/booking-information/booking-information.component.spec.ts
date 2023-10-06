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

  it('should query sales and update booking data on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.bookingData.at(0)).toEqual(
      {
        id: jasmine.any(String),
        saleNumber: jasmine.any(Number),
        identifier: jasmine.any(String),
        name: jasmine.any(String),
        item: jasmine.any(String),
        price: jasmine.any(Number),
        paid: jasmine.any(Number),
        due: jasmine.any(Number),
        date: jasmine.any(Date),
      }
    );
  });

  it('should update booking data on querySales', async () => {
    await component.querySales();
    expect(component.bookingData.at(0)).toEqual(
      {
        id: jasmine.any(String),
        saleNumber: jasmine.any(Number),
        identifier: jasmine.any(String),
        name: jasmine.any(String),
        item: jasmine.any(String),
        price: jasmine.any(Number),
        paid: jasmine.any(Number),
        due: jasmine.any(Number),
        date: jasmine.any(Date),
      }
    );
  });
});
