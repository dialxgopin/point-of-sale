import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { InstallmentsComponent } from '../installments/installments.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
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
        SalesComponent
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
