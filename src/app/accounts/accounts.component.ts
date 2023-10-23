import { Component } from '@angular/core';
import { Bank } from '../models/bank';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import { CreditSystem } from '../models/credit-system';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {
  banksData: Bank[] = [];
  creditSystemsData: CreditSystem[] = [];
  isVisibleTableBody: boolean = true;

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) { }

  ngOnInit() {
    this.getBanks();
    this.getCreditSystems();
  }

  addBank() {
    const newRow: Bank = {
      id: uuidv4(),
      name: '',
    };
    this.banksData.push(newRow);
  }

  addCreditSystem() {
    const newCreditSystem: CreditSystem = {
      id: uuidv4(),
      name: '',
    };
    this.creditSystemsData.push(newCreditSystem);
  }

  saveBank(index: number) {
    if (this.banksData[index].name) {
      this.databaseService.banks.put(this.banksData[index]);
      this.filtersService.updateAccounts(Math.random());
    }
  }

  saveCreditSystem(index: number) {
    if (this.creditSystemsData[index].name) {
      this.databaseService.creditSystems.put(this.creditSystemsData[index]);
      this.filtersService.updateAccounts(Math.random());
    }
  }

  async getBanks() {
    this.banksData = await this.databaseService.banks.toArray();
  }

  async getCreditSystems() {
    this.creditSystemsData = await this.databaseService.creditSystems.toArray();
  }

  toggleTableBodyVisibility() {
    this.isVisibleTableBody = !this.isVisibleTableBody;
  }
}
