import { Component } from '@angular/core';
import { FiltersService } from './filters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private filtersService: FiltersService) { }

  handleDateSelected(selectedDate: Date) {
    this.filtersService.setDate(selectedDate);
  }
}
