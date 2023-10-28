import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountsComponent } from '../accounts/accounts.component';
import { BookingInformationComponent } from '../booking-information/booking-information.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { ExpensesComponent } from '../expenses/expenses.component';
import { InstallmentsComponent } from '../installments/installments.component';
import { PaymentHistoryComponent } from '../payment-history/payment-history.component';
import { ReportsComponent } from '../reports/reports.component';
import { SalesComponent } from '../sales/sales.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabsComponent,
        InstallmentsComponent,
        DataTableComponent,
        SalesComponent,
        BookingsComponent,
        BookingInformationComponent,
        ExpensesComponent,
        AccountsComponent,
        PaymentHistoryComponent,
        ReportsComponent
      ],
      imports: [
        MatTabsModule,
        BrowserAnimationsModule,
        FormsModule
      ]
    });

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected tab index', () => {
    const index = 2;
    const matTabChangeEvent: MatTabChangeEvent = {
      index,
      tab: null!,
    };
    const emitSpy = spyOn(component.selectedTab, 'emit');
    component.onTabChange(matTabChangeEvent);
    expect(emitSpy).toHaveBeenCalledWith(index);
  });
});