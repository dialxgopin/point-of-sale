import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  afterEach(() => {
    component.subscription.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call database.saveData method during addRow', () => {
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
});