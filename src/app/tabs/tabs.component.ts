import { Component, EventEmitter, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
  @Output() selectedTab: EventEmitter<number> = new EventEmitter<number>();

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTab.emit(event.index);
  }
}
