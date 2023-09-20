import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { InstallmentsComponent } from './installments/installments.component';
import { DataTableComponent } from './data-table/data-table.component';
import { TabsComponent } from './tabs/tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FiltersService } from './filters.service';

describe('AppComponent', () => {
  let filtersService: FiltersService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule],
    declarations: [
      AppComponent,
      InstallmentsComponent,
      DataTableComponent,
      TabsComponent,
      DatepickerComponent
    ],
    providers: [FiltersService]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call FiltersService setDate when handleDateSelected is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    const selectedDate = new Date('2023-08-31');
    const setDateSpy = spyOn(filtersService, 'setDate');
    app.handleDateSelected(selectedDate);
    expect(setDateSpy).toHaveBeenCalledWith(selectedDate);
  });
});
