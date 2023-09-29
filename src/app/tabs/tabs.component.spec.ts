import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { InstallmentsComponent } from '../installments/installments.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SalesComponent } from '../sales/sales.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { BookingInformationComponent } from '../booking-information/booking-information.component';
import { ExpensesComponent } from '../expenses/expenses.component';

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
        ExpensesComponent
      ],
      imports: [
        MatTabsModule,
        BrowserAnimationsModule,
        FormsModule
      ]
    });
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
