import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { InstallmentsComponent } from './installments/installments.component';
import { DataTableComponent } from './data-table/data-table.component';
import { TabsComponent } from './tabs/tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FiltersService } from './filters.service';
import { SalesComponent } from './sales/sales.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingInformationComponent } from './booking-information/booking-information.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AccountsComponent } from './accounts/accounts.component';

describe('AppComponent', () => {
  let filtersService: FiltersService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatTabsModule,
      MatDatepickerModule,
      MatNativeDateModule
    ],
    declarations: [
      AppComponent,
      InstallmentsComponent,
      DataTableComponent,
      TabsComponent,
      DatepickerComponent,
      SalesComponent,
      BookingsComponent,
      BookingInformationComponent,
      ExpensesComponent,
      AccountsComponent
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
