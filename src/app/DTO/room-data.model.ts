import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoomData {
  userName: string = '';
  roomId: string = '';
  isAdmin: boolean = false;
  usersList:any[]=[];
  timerState: number = 60;
}
