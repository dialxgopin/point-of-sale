import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookingsComponent } from './bookings.component';
import { FiltersService } from '../filters.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('BookingsComponent', () => {
  let component: BookingsComponent;
  let fixture: ComponentFixture<BookingsComponent>;
  let filtersService: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [FiltersService]
    });

    fixture = TestBed.createComponent(BookingsComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new row', () => {
    const initialRowCount = component.bookingData.length;
    component.addRow();
    const finalRowCount = component.bookingData.length;
    expect(finalRowCount).toBeGreaterThan(initialRowCount);
    const addedRow = component.bookingData[finalRowCount - 1];
    expect(addedRow.id).toBeTruthy();
  });

  it('should save a row when identifier is present', () => {
    component.addRow();
    const index = 0;
    component.bookingData[index].identifier = 'some-identifier';
    component.saveRow(index);
    expect(component.bookingData).toContain(component.bookingData[index]);
  });

  it('should refresh bookings data from database on table date change', fakeAsync(() => {
    const newDate = new Date('2023-09-01');
    filtersService.setDate(newDate);
    tick();
    expect(component.tableDate).toEqual(newDate);
    component.refreshBookingsDataFromDatabase();
    tick();
    expect(component.bookingData).toEqual([]);
  }));

  it('should calculate the total quantity correctly', () => {
    const mockBookings: any[] = [
      { id: '1', identifier: 'ID1', name: 'Test', quantity: 5, date: new Date() },
      { id: '2', identifier: 'ID2', name: 'Test 2', quantity: 10, date: new Date() },
    ];
    component.bookingData = mockBookings;
    component.calculateTotal();
    expect(component.bookingTotal.quantity).toEqual(15);
  });

  it('should add a new row and clear sales data', () => {
    component.addRow();
    expect(component.bookingData.length).toBeGreaterThan(0);
    expect(component.salesData.length).toBe(0);
  });

  it('should save a row if the identifier is present and a sale is selected', () => {
    component.addRow();
    component.bookingData[0].identifier = 'testIdentifier';
    component.salesData.push(
      {
        id: '1',
        saleNumber: 1,
        identifier: 'testIdentifier',
        name: 'Test1',
        item: 'Item1',
        price: 100,
        card: 50,
        cash: 50,
        installments: 2,
        date: new Date(),
        selected: true
      }
    );
    component.saveRow(0);
    expect(component.bookingData).not.toEqual([]);
  });

  it('should query client sales by identifier and update the salesData', async () => {
    component.addRow();
    component.bookingData[0].identifier = 'testIdentifier';
    component.salesData.push(
      {
        id: '1',
        saleNumber: 1,
        identifier: 'testIdentifier',
        name: 'Test1',
        item: 'Item1',
        price: 100,
        card: 50,
        cash: 50,
        installments: 2,
        date: new Date(),
        selected: true
      }
    );
    component.saveRow(0);
    await component.queryClientSalesByIdentifier(0);
    expect(component.salesData.length).toBeGreaterThan(0);
    expect(component.salesData[0].selected).toBe(true);
  });

  it('should query client sales by name and update the salesData', async () => {
    component.addRow();
    component.bookingData[0].identifier = 'testIdentifier';
    component.salesData.push(
      {
        id: '1',
        saleNumber: 1,
        identifier: 'testIdentifier',
        name: 'TestName',
        item: 'Item1',
        price: 100,
        card: 50,
        cash: 50,
        installments: 2,
        date: new Date(),
        selected: true
      }
    );
    component.saveRow(0);
    component.bookingData[0].name = 'TestName';
    await component.queryClientSalesByName(0);
    expect(component.salesData.length).toBeGreaterThan(0);
    expect(component.salesData[0].selected).toBe(true);
  });

  it('should select a row in salesData', () => {
    component.addRow();
    component.salesData.push(
      {
        id: '1',
        saleNumber: 1,
        identifier: 'testIdentifier',
        name: 'TestName',
        item: 'Item1',
        price: 100,
        card: 50,
        cash: 50,
        installments: 2,
        date: new Date(),
        selected: false
      }
    );
    component.selectRow(0, 0);
    expect(component.salesData[0].selected).toBe(true);//
  });
});