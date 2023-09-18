import { Component } from '@angular/core';
import { IndexedDBService } from '../indexed-db.service';
import { v4 as uuidv4 } from 'uuid';

interface Installment {
  id: string;
  identifier: string;
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
    { id: uuidv4(), identifier: '', name: '', price: 0 }
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

  addRow() {
    const newRow: Installment = { id: uuidv4(), identifier: '', name: '', price: 0 };
    this.installmentsData.push(newRow);
  }

  saveRow(index: number) {
    if (this.installmentsData[index].identifier) {
      this.indexedDBService.saveData([this.installmentsData[index]]);
    }
  }
}
