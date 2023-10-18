import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InstallmentsComponent } from './installments.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { BehaviorSubject } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('InstallmentsComponent', () => {
  let component: InstallmentsComponent;
  let fixture: ComponentFixture<InstallmentsComponent>;

  const filtersServiceStub = {
    tableDate$: new BehaviorSubject<Date>(new Date()),
    rowCount$: new BehaviorSubject<number>(0),
  };

  const databaseServiceStub = {
    sales: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([]),
        }),
        equals: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentsComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [
        { provide: FiltersService, useValue: filtersServiceStub },
        { provide: DatabaseService, useValue: databaseServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query sales', fakeAsync(() => {
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.querySales();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should calculate total', () => {
    component.installmentsData = [
      { id: '1', identifier: 'test', name: 'test', installments: 10, date: new Date() },
      { id: '2', identifier: 'test', name: 'test', installments: 15, date: new Date() },
    ];
    component.calculateTotal();
    expect(component.installmentsTotal.price).toBe(25);
  });

  it('should query sales by identifier', fakeAsync(() => {
    component.searchIdentifier = 'test';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByIdentifier();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query sales when searchIdentifier is empty', fakeAsync(() => {
    component.searchIdentifier = '';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByIdentifier();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query sales by name', fakeAsync(() => {
    component.searchName = 'test';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByName();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query sales when searchName is empty', fakeAsync(() => {
    component.searchName = '';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByName();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));
});