import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExpensesComponent } from './expenses.component';
import { FiltersService } from '../filters.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;
  let filtersService: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [FiltersService],
    });
    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new row', () => {
    const initialRowCount = component.expenseData.length;
    component.addRow();
    const finalRowCount = component.expenseData.length;
    expect(finalRowCount).toBeGreaterThan(initialRowCount);
    const addedRow = component.expenseData[finalRowCount - 1];
    expect(addedRow.id).toBeTruthy();
  });

  it('should save a row when identifier is present', () => {
    const index = 0;
    component.expenseData[index].identifier = 'some-identifier';
    component.saveRow(index);
    expect(component.expenseData).toContain(component.expenseData[index]);
  });

  it('should refresh expenses data from database on table date change', fakeAsync(() => {
    const newDate = new Date('2023-09-01');
    filtersService.setDate(newDate);
    tick();
    expect(component.tableDate).toEqual(newDate);
    component.refreshInstallmentsDataFromDatabase();
    tick();
    expect(component.expenseData).not.toEqual([]);
  }));

  it('should calculate the total price correctly', () => {
    const mockExpenses: any[] = [
      { id: '1', identifier: 'ID1', name: 'Item 1', price: 100, date: new Date() },
      { id: '2', identifier: 'ID2', name: 'Item 2', price: 50, date: new Date() },
    ];
    component.expenseData = mockExpenses;
    component.calculateTotal();
    expect(component.expenseTotal.price).toEqual(150);
  });
});
