import { Component } from '@angular/core';
import { IndexedDBService } from '../indexed-db.service';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Subscription } from 'rxjs';

interface Installment {
  id: string;
  identifier: string;
  name: string;
  price: number;
  date: Date;
}

@Component({
  selector: 'app-installments',
  templateUrl: './installments.component.html',
  styleUrls: ['./installments.component.css']
})
export class InstallmentsComponent {
  installmentsData: Installment[] = [
    { id: uuidv4(), identifier: '', name: '', price: 0, date: new Date() }
  ];

  private dbName = 'installmentsDB';
  private storeName = 'installmentsStore';

  subscription: Subscription;
  tableDate: Date = new Date();

  constructor(private indexedDBService: IndexedDBService,
    private filtersService: FiltersService) {
    this.subscription = this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
      }
    );
    this.indexedDBService.setDatabaseAndStore(this.dbName, this.storeName);
  }

  ngOnInit(): void {
    this.saveToIndexedDB();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  saveToIndexedDB() {
    this.indexedDBService.saveData(this.installmentsData);
  }

  addRow() {
    const newRow: Installment = { id: uuidv4(), identifier: '', name: '', price: 0, date: this.tableDate };
    this.installmentsData.push(newRow);
  }

  saveRow(index: number) {
    if (this.installmentsData[index].identifier) {
      this.indexedDBService.saveData([this.installmentsData[index]]);
    }
  }
}
