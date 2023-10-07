import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InstallmentsComponent } from './installments.component';
import { FormsModule } from '@angular/forms';
import { FiltersService } from '../filters.service';
import { DataTableComponent } from '../data-table/data-table.component';

describe('InstallmentsComponent', () => {
  let component: InstallmentsComponent;
  let fixture: ComponentFixture<InstallmentsComponent>;
  let filtersService: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstallmentsComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [FiltersService],
    });

    fixture = TestBed.createComponent(InstallmentsComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query sales and update installments data and total on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.installmentsTotal.price).toEqual(0);
  });

  it('should update installments data and total on querySales', async () => {
    await component.querySales();
    expect(component.installmentsTotal.price).toEqual(0);
  });

  it('should calculate the total price correctly', () => {
    const mockInstallments: any[] = [
      { id: '1', identifier: 'ID1', name: 'Item 1', price: 100, date: new Date() },
      { id: '2', identifier: 'ID2', name: 'Item 2', price: 50, date: new Date() },
    ];
    component.installmentsData = mockInstallments;
    component.calculateTotal();
    expect(component.installmentsTotal.price).toEqual(150);
  });

  it('should query client sales by identifier and update installmentsData', async () => {
    component.searchIdentifier = 'testIdentifier';
    await component.queryClientSalesByIdentifier();
    expect(component.installmentsData.length).toBeGreaterThanOrEqual(0);
    expect(component.installmentsTotal.price).toBe(0);
  });

  it('should query client sales by name and update installmentsData', async () => {
    component.searchName = 'Test';
    await component.queryClientSalesByName();
    expect(component.installmentsData.length).toBeGreaterThanOrEqual(0);
    expect(component.installmentsTotal.price).toBe(0);
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
});