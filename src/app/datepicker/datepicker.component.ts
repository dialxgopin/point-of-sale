import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();
  defaultDate = new Date();

  onDateChange(event: any) {
    this.dateSelected.emit(event.value);
  }
}
