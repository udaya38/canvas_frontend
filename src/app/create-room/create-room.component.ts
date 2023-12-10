import { Component, EventEmitter, Output } from '@angular/core';
import { RoomData } from '../DTO/room-data.model';
import { FormGroup, FormControl, Validators } from '@angular/forms'
@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  @Output()
  outputEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(public model: RoomData) {}

  onSubmit(type:string) {
    this.model.isAdmin=type === "create";
    this.outputEmitter.emit(true);
  }
}
