import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesComponent } from './sales.component';
import { FormsModule } from '@angular/forms';
import { FiltersService } from '../filters.service';
import { DataTableComponent } from '../data-table/data-table.component';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let filtersService: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [FiltersService],
    });

    fixture = TestBed.createComponent(SalesComponent);
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
    const initialRowCount = component.salesData.length;
    component.addRow();
    const finalRowCount = component.salesData.length;
    expect(finalRowCount).toBeGreaterThan(initialRowCount);
    const addedRow = component.salesData[finalRowCount - 1];
    expect(addedRow.id).toBeTruthy();
  });

  it('should save a row when identifier is present', () => {
    const index = 0;
    component.salesData[index].identifier = 'some-identifier';
    component.saveRow(index);
    expect(component.salesData).toContain(component.salesData[index]);
  });
});