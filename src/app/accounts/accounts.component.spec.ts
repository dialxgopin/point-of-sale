import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsComponent } from './accounts.component';
import { Bank } from '../models/bank';
import { CreditSystem } from '../models/credit-system';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import { of } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  const databaseServiceStub = {
    banks: {
      put: jasmine.createSpy(),
      toArray: jasmine.createSpy().and.returnValue(Promise.resolve([])),
    },
    creditSystems: {
      put: jasmine.createSpy(),
      toArray: jasmine.createSpy().and.returnValue(Promise.resolve([])),
    },
  };

  const filtersServiceStub = {
    changeRowCount: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsComponent, DataTableComponent],
      providers: [
        { provide: DatabaseService, useValue: databaseServiceStub },
        { provide: FiltersService, useValue: filtersServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a bank', () => {
    const initialLength = component.banksData.length;
    component.addBank();
    expect(component.banksData.length).toBe(initialLength + 1);
  });

  it('should add a credit system', () => {
    const initialLength = component.creditSystemsData.length;
    component.addCreditSystem();
    expect(component.creditSystemsData.length).toBe(initialLength + 1);
  });

  it('should save a bank', () => {
    const bank: Bank = { id: '1', name: 'Bank Name' };
    component.banksData.push(bank);
    component.saveBank(0);
    expect(databaseServiceStub.banks.put).toHaveBeenCalledWith(bank);
    expect(filtersServiceStub.changeRowCount).toHaveBeenCalled();
  });

  it('should save a credit system', () => {
    const creditSystem: CreditSystem = { id: '1', name: 'Credit System Name' };
    component.creditSystemsData.push(creditSystem);
    component.saveCreditSystem(0);
    expect(databaseServiceStub.creditSystems.put).toHaveBeenCalledWith(creditSystem);
    expect(filtersServiceStub.changeRowCount).toHaveBeenCalled();
  });

  it('should fetch banks', async () => {
    const banks: Bank[] = [{ id: '1', name: 'Bank 1' }, { id: '2', name: 'Bank 2' }];
    databaseServiceStub.banks.toArray.and.returnValue(Promise.resolve(banks));
    await component.getBanks();
    expect(component.banksData).toEqual(banks);
  });

  it('should fetch credit systems', async () => {
    const creditSystems: CreditSystem[] = [
      { id: '1', name: 'System 1' },
      { id: '2', name: 'System 2' },
    ];
    databaseServiceStub.creditSystems.toArray.and.returnValue(Promise.resolve(creditSystems));
    await component.getCreditSystems();
    expect(component.creditSystemsData).toEqual(creditSystems);
  });

  it('should toggle table body visibility', () => {
    const initialValue = component.isVisibleTableBody;
    component.toggleTableBodyVisibility();
    expect(component.isVisibleTableBody).toBe(!initialValue);
  });
});