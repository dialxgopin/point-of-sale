import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private tableDateSubject = new BehaviorSubject<Date>(new Date());

  tableDate$ = this.tableDateSubject.asObservable();

  setDate(date: Date) {
    this.tableDateSubject.next(date);
  }
}
