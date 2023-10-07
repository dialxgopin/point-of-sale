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

  it('should query client sales by identifier and update bookingData', async () => {
    component.searchIdentifier = 'testIdentifier';
    await component.queryClientSalesByIdentifier();
    expect(component.bookingData.length).toBeGreaterThanOrEqual(0);
  });

  it('should query client sales by name and update bookingData', async () => {
    component.searchName = 'Test';
    await component.queryClientSalesByName();
    expect(component.bookingData.length).toBeGreaterThanOrEqual(0);
  });

  it('should reset searchName and query sales when identifier is empty', async () => {
    spyOn(component, 'querySales');
    component.searchIdentifier = '';
    component.searchName = 'Test';
    await component.queryClientSalesByIdentifier();
    expect(component.searchName).toBe('');
    expect(component.querySales).toHaveBeenCalled();
  });

  it('should reset searchIdentifier and query sales when name is empty', async () => {
    spyOn(component, 'querySales');
    component.searchName = '';
    component.searchIdentifier = 'testIdentifier';
    await component.queryClientSalesByName();
    expect(component.searchIdentifier).toBe('');
    expect(component.querySales).toHaveBeenCalled();
  });

  it('should sum sale payments', async () => {
    const result = await component['sumSalePayments'](100);
    expect(result).toBe(0);
  });
});
