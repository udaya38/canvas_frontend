import { Component } from '@angular/core';
import { RoomData } from './DTO/room-data.model';
import { MatDialog } from '@angular/material/dialog';
import { WordPickerComponent } from './word-picker/word-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  words = ['Angular', 'React', 'Vue', 'JavaScript', 'TypeScript'];
  isJoined = false;
  isGameTriggered = false;
  isStopped: boolean=false;
  constructor(public model: RoomData,public dialog: MatDialog) {}
  outputEmitter(data:any) {
    this.isJoined = true;
  }
  openWordPicker(): void {
    const dialogRef = this.dialog.open(WordPickerComponent, {
      data: { words: this.words }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Do something with the selected word
      }
    });
  }

  triggerGame(data:any){
    this.isGameTriggered=true;
    this.isStopped=data;
  }
}
