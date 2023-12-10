import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-word-picker',
  templateUrl: './word-picker.component.html',
  styleUrls: ['./word-picker.component.scss']
})
export class WordPickerComponent {
  timer: number = 10;
  constructor(
    public dialogRef: MatDialogRef<WordPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { words: string[] }
  ) {}


  ngOnInit() {
    this.startTimer();
  }
  startTimer() {
    const timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(timerInterval);
        this.dialogRef.close(); // Close the dialog after the timer reaches 0
      }
    }, 1000);
  }

  onWordSelected(word: string): void {
   clearInterval(this.timer);
    this.dialogRef.close(word);
  }
}
