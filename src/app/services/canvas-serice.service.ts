import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanvasSericeService {
  canvasListner: EventEmitter<any> = new EventEmitter();
  drawHistory: any[] = [];
  pointerValue: number = 0;
  constructor() {}

  canvasEmit(data: any) {
    this.canvasListner.emit(data);
  }

  canvasSubscribe() {
    return this.canvasListner.asObservable();
  }
}
