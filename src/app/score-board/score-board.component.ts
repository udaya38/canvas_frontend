import { Component } from '@angular/core';
import { RoomData } from '../DTO/room-data.model';
import { CanvasSocketServiceService } from '../services/canvas-socket-service.service';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent {
  dataSource=[];
  displayedColumns=["Name","Score"]
  constructor(private socketService: CanvasSocketServiceService,public userDetails: RoomData) {}

  ngOnInit() {
    this.socketService.message$.subscribe((data) => {
      if (data.type === 'room') {
        this.dataSource=data.details?.users?.map((e:any)=>{
          return {
            userName:e,
            score:0,
            chance:0
          }
        })
      }else if(data.type === "scoredetails"){
        this.dataSource=data.details.scoreDetails?.sort((a:any,b:any)=> b.score-a.score);
        this.userDetails.usersList=this.dataSource;
      }else if(data.type === "nextuser"){
        //this.userDetails.usersList = this.dataSource=data.details.usersList;
      }
    });
  }
}
