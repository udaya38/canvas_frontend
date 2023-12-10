import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordPickerComponent } from '../word-picker/word-picker.component';
import { CanvasSocketServiceService } from '../services/canvas-socket-service.service';

@Component({
  selector: 'app-final-score',
  templateUrl: './final-score.component.html',
  styleUrls: ['./final-score.component.scss']
})
export class FinalScoreComponent {
  timer: number = 10;
  displayedColumns=["Name","Score"]
  dataSource:any=[];
  constructor(
    public dialogRef: MatDialogRef<FinalScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public listner: CanvasSocketServiceService
  ) {}

  ngOnInit() {
    this.dataSource = this.data;
    this.dialogRef.afterClosed().subscribe(()=>{
      alert("Game has been finished");
      window.location.reload();
    })
  }
}
