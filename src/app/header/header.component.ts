import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomData } from '../DTO/room-data.model';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input('isJoined') isJoined: boolean = false;
  @Output()
  triggerGame: EventEmitter<boolean> = new EventEmitter<boolean>();
  isStopped: boolean = false;
  toggle: boolean = false;
  words = ['Angular', 'React', 'Vue', 'JavaScript', 'TypeScript'];
  constructor(public userDetails: RoomData, public dialog: MatDialog) {}

  onToggle() {
    if (this.toggle) {
      this.isStopped = true;
    }
    this.toggle = !this.toggle;

    this.triggerGame.emit(this.isStopped);
  }
}
