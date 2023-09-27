import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Subscription } from 'rxjs';
import { Database } from '../database';

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
  private database: Database;

  tableDate: Date = new Date();

  constructor(private filtersService: FiltersService) {
    this.database = new Database();
    this.database.setDatabaseAndStore(this.dbName, this.storeName);
  }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.refreshInstallmentsDataFromDatabase();
      }
    );
  }

  addRow() {
    const newRow: Installment = { id: uuidv4(), identifier: '', name: '', price: 0, date: this.tableDate };
    this.installmentsData.push(newRow);
  }

  saveRow(index: number) {
    if (this.installmentsData[index].identifier) {
      this.database.saveData([this.installmentsData[index]]);
    }
  }

  refreshInstallmentsDataFromDatabase() {
    const startDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate()
    );
    const endDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate() + 1
    );

    this.database.queryByDate(startDate, endDate).then((results) => {
      this.installmentsData = results as Installment[];
    }).catch((error) => {
      console.error('Error:', error);
    });
  }
}
