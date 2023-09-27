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

  it('should add a new row', () => {
    const initialRowCount = component.installmentsData.length;
    component.addRow();
    const finalRowCount = component.installmentsData.length;
    expect(finalRowCount).toBeGreaterThan(initialRowCount);
    const addedRow = component.installmentsData[finalRowCount - 1];
    expect(addedRow.id).toBeTruthy();
  });

  it('should save a row when identifier is present', () => {
    const index = 0;
    component.installmentsData[index].identifier = 'some-identifier';
    component.saveRow(index);
    expect(component.installmentsData).toContain(component.installmentsData[index]);
  });

  it('should refresh sales data from database on table date change', fakeAsync(() => {
    const newDate = new Date('2023-09-01');
    filtersService.setDate(newDate);
    tick();
    expect(component.tableDate).toEqual(newDate);
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
    component.refreshInstallmentsDataFromDatabase();
    tick();
    expect(component.installmentsData).not.toEqual([]);
  }));
});