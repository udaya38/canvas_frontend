import { Component, Input } from '@angular/core';
import { CanvasSericeService } from '../services/canvas-serice.service';
import { RoomData } from '../DTO/room-data.model';
import { CanvasSocketServiceService } from '../services/canvas-socket-service.service';
import { FinalScoreComponent } from '../final-score/final-score.component';
import { MatDialog } from '@angular/material/dialog';

type Config = {
  color: string;
  brushSize: number;
};
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  @Input('userName') userName = '';
  @Input('roomId') roomId = '';
  @Input("isStopped") stop: boolean=false;
  colorList = [
    '#000000',
    '#ff7f50',
    '#87cefa',
    '#da70d6',
    '#32cd32',
    '#6495ed',
    '#ff69b4',
    '#ba55d3',
    '#cd5c5c',
    '#ffa500',
    '#40e0d0',
  ];
  canvasConfig: Config = {
    color: 'black',
    brushSize: 1,
  };
  rangeValue: number = 1;
  eraseValue: number = 1;
  selectedIcon: string = 'pencil';
  brushColor: string = 'black';
  isBrushSelected: boolean = true;
  isBrushSizeSelected: boolean = false;
  isEraseSizeSelected: boolean = false;
  isColorsSelected: boolean = false;
  isChoosing:boolean = false;
  userChoosing: string = "";
  showTimer: boolean = false;
  timer: number = 60;
  wordSelected: string = "";
  isSelected: boolean = false;
  wordArrayString: string="";
  constructor(private canvasService: CanvasSericeService, public listner: CanvasSocketServiceService,public userDetails:RoomData,public dialog: MatDialog) {}

  ngOnInit() {
    this.listner.wordsListner$.subscribe(async(data)=>{
      if(data.type === "choose"){
        this.isChoosing=true;
        this.isSelected=false;
        const {message,userName}=data.details;
        this.userChoosing=`${userName} ${message}`
      }else if(data.type === "selected"){
        this.listner.sendSelectedWord(data.word)
        this.startTimer();
      }else if(data.type === "selectedword"){
        this.isChoosing=false;
        this.isSelected=true;
        const {userName,word}=data.details;
        this.userChoosing=`${userName} is drawing `
        this.wordSelected=data.details.word;
        this.wordArrayString=new Array(this.wordSelected.length).fill("_").join(" ");
        this.startGuessingTimer();
      }else if(data.type === "show"){
        this.wordArrayString=this.wordSelected.toUpperCase();
      }else if(data.type === "nextuser"){
        this.isChoosing=false;
        this.isSelected=false;
      }else if(data.type === "reload"){
        if(this.userDetails.isAdmin){
          window.location.reload()
        }else{
          alert("Admin stopped the game");
          setTimeout(()=>{
            window.location.reload();
          },2000)
        }
      }
    })
  }

  ngOnChanges(){
    if(this.stop){
      this.listner.sendReload(false);
    }
  }

  startTimer() {
    this.showTimer=true;
    const timerInterval = setInterval(() => {
      this.timer--;
      this.userDetails.timerState--;
      if (this.timer === 0) {
        clearInterval(timerInterval);
        this.timer=60;
        this.userDetails.timerState=60;
        //this.wordArrayString=this.wordSelected.toUpperCase();
        this.showTimer=false;
        setTimeout(()=>{
          this.userDetails.usersList.forEach((e:any)=>{
            if(e.userName === this.userDetails.userName){
              e.chance=1;
            }
          });
          const nextuser = this.userDetails.usersList.find((e:any)=> e.chance === 0);
          if(!nextuser){
            this.listner.gameEnd();
            this.dialog.open(FinalScoreComponent,{
              data: this.userDetails.usersList
            });
            return;
          }
          this.listner.sendCanvasReset();
          this.listner.sendToNextUser({
            nextuser
          });
        },2000)
      }
    }, 1000);
  }

  startGuessingTimer(){
    this.showTimer=true;
    const timerInterval = setInterval(() => {
      this.timer--;
      this.userDetails.timerState--;
      if (this.timer === 0) {
        clearInterval(timerInterval);
        this.timer=60;
        this.userDetails.timerState=60;
        this.wordArrayString=this.wordSelected.toUpperCase();
        this.showTimer=false;
      }
    }, 1000);
  }
  changeBrushSize() {
    this.canvasConfig = {
      color: 'red',
      brushSize: this.rangeValue,
    };
  }

  onIconClick(target: any) {
    const value = target.id;
    this.isBrushSizeSelected = false;
    this.isColorsSelected = false;
    this.isEraseSizeSelected = false;
    if (value === 'pencil') {
      this.selectedIcon = 'pencil';
      this.isBrushSelected = true;
      this.onRangeChange(this.rangeValue);
    } else if (value === 'eraser') {
      this.selectedIcon = 'eraser';
      this.isBrushSelected = true;
      this.onRangeChange(this.eraseValue);
    } else if (value === 'undo') {
     
      //this.selectedIcon = 'undo';
      //this.isBrushSelected = false;
      if (this.canvasService.pointerValue > 0) {
        this.canvasService.pointerValue -= 1;
        this.canvasService.canvasEmit({
          type: 'undo',
        });
      }
    } else if (value === 'redo') {
      //this.selectedIcon = 'redo';
      //this.isBrushSelected = false;
      if (
        this.canvasService.pointerValue <
        this.canvasService.drawHistory.length - 1
      ) {
        this.canvasService.pointerValue += 1;
        this.canvasService.canvasEmit({
          type: 'redo',
        });
      }
    } else if (value === 'clear') {
      this.canvasService.canvasEmit({
        type: 'clear',
      });
      this.rangeValue = 1;
      this.eraseValue = 1;
      this.selectedIcon = 'pencil';
      this.brushColor = 'black';
    } else {
      return;
    }
  }

  onSizeClick(target: any) {
    const value = target.id;
    if (value === 'brushsize') {
      if (this.selectedIcon === 'eraser') {
        this.isColorsSelected = false;
        this.isEraseSizeSelected = !this.isEraseSizeSelected;
        return;
      }
      this.isColorsSelected = false;
      this.isBrushSizeSelected = !this.isBrushSizeSelected;
    } else if (value === 'colors') {
      this.isBrushSizeSelected = false;
      this.isColorsSelected = !this.isColorsSelected;
    } else {
      return;
    }
  }

  onRangeChange(event: any) {
    if (this.selectedIcon === 'eraser') {
      this.eraseValue = parseInt(event);
      this.canvasConfig = {
        color: 'white',
        brushSize: this.eraseValue,
      };
      return;
    }
    this.rangeValue = parseInt(event);
    this.canvasConfig = {
      brushSize: this.rangeValue,
      color: this.brushColor,
    };
  }

  onColorClick(event: any) {
    if (event.className !== 'droplet') {
      return;
    }
    this.isColorsSelected = false;
    this.brushColor = event.style.backgroundColor;
    this.canvasConfig.color = this.brushColor;
    this.canvasConfig = { ...this.canvasConfig };
  }
}
