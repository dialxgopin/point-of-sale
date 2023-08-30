import { Component, OnInit } from '@angular/core';
import { IndexedDBService } from '../indexed-db.service';

interface Installment {
  identifier: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-installments',
  templateUrl: './installments.component.html',
  styleUrls: ['./installments.component.css']
})
export class InstallmentsComponent {
  installmentsData: Installment[] = [
    { identifier: 1, name: 'Installment 1', price: 100 },
    { identifier: 2, name: 'Installment 2', price: 150 },
    { identifier: 3, name: 'Installment 3', price: 200 },
    // Add more data as needed
  ];

  private dbName = 'installmentsDB';
  private storeName = 'installmentsStore';

  constructor(private indexedDBService: IndexedDBService) {
    this.indexedDBService.setDatabaseAndStore(this.dbName, this.storeName);
  }

  ngOnInit(): void {
    this.saveToIndexedDB();
  }

  saveToIndexedDB() {
    this.indexedDBService.saveData(this.installmentsData);
  }
}
