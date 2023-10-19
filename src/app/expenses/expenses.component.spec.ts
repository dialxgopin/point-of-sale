import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExpensesComponent } from './expenses.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { BehaviorSubject } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;

  const filtersServiceStub = {
    tableDate$: new BehaviorSubject<Date>(new Date()),
    updateTotalExpense: () => { },
  };

  const databaseServiceStub = {
    expenses: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
      put: () => Promise.resolve(),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [
        { provide: FiltersService, useValue: filtersServiceStub },
        { provide: DatabaseService, useValue: databaseServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a row', () => {
    const initialRowCount = component.expenseData.length;
    component.addRow();
    expect(component.expenseData.length).toBe(initialRowCount + 1);
  });

  it('should save a row', fakeAsync(() => {
    component.expenseData = [
      { id: '1', identifier: 'A', name: 'Expense 1', price: 50, date: new Date() }
    ];
    const spyExpensesPut = spyOn(databaseServiceStub.expenses, 'put').and.returnValue(Promise.resolve());
    component.saveRow(0);
    tick();
    expect(spyExpensesPut).toHaveBeenCalled();
  }));

  it('should refresh data from the database', fakeAsync(() => {
    const spyExpensesWhere = spyOn(databaseServiceStub.expenses, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.refreshExpenseDataFromDatabase();
    tick();
    expect(spyExpensesWhere).toHaveBeenCalled();
  }));

  it('should calculate total', () => {
    component.expenseData = [
      { id: '1', identifier: 'A', name: 'Expense 1', price: 50, date: new Date() },
      { id: '2', identifier: 'B', name: 'Expense 2', price: 30, date: new Date() },
    ];
    component.calculateTotal();
    expect(component.expenseTotal.price).toBe(80);
  });
});