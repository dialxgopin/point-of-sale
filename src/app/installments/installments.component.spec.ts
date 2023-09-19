import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentsComponent } from './installments.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { IndexedDBService } from '../indexed-db.service';

describe('InstallmentsComponent', () => {
  let component: InstallmentsComponent;
  let fixture: ComponentFixture<InstallmentsComponent>;
  let indexedDBServiceSpy: jasmine.SpyObj<IndexedDBService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('IndexedDBService', ['setDatabaseAndStore', 'saveData']);

    TestBed.configureTestingModule({
      declarations: [InstallmentsComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [{ provide: IndexedDBService, useValue: spy }]
    });
    indexedDBServiceSpy = TestBed.inject(IndexedDBService) as jasmine.SpyObj<IndexedDBService>;
    fixture = TestBed.createComponent(InstallmentsComponent);
    component = fixture.componentInstance;
    indexedDBServiceSpy.setDatabaseAndStore.and.callThrough();
    indexedDBServiceSpy.saveData.and.returnValue(Promise.resolve());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set database and store names in constructor', () => {
    expect(indexedDBServiceSpy.setDatabaseAndStore).toHaveBeenCalledWith('installmentsDB', 'installmentsStore');
  });

  it('should call saveToIndexedDB method during ngOnInit', () => {
    spyOn(component, 'saveToIndexedDB');
    component.ngOnInit();
    expect(component.saveToIndexedDB).toHaveBeenCalled();
  });

  it('should call indexedDBService.saveData method during saveToIndexedDB', (done: DoneFn) => {
    component.saveToIndexedDB();

    fixture.whenStable().then(() => {
      expect(indexedDBServiceSpy.saveData).toHaveBeenCalledWith(component.installmentsData);
      done();
    });
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
    expect(indexedDBServiceSpy.saveData).toHaveBeenCalledWith([component.installmentsData[index]]);
  });
});
