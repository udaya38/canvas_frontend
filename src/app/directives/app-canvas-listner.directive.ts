import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CanvasSericeService } from '../services/canvas-serice.service';
import { CanvasSocketServiceService } from '../services/canvas-socket-service.service';

@Directive({
  selector: '[appAppCanvasListner]',
})
export class AppCanvasListnerDirective implements OnInit, OnChanges {
  isStarted: boolean = false;
  context!: CanvasRenderingContext2D;
  pointerValue: number = 0;
  constructor(
    private el: ElementRef,
    private canvasService: CanvasSericeService,
    private canvasSocketService: CanvasSocketServiceService
  ) {}
  @Input('configs') configs: any = {};

  ngOnChanges(value: SimpleChanges) {
    const {
      previousValue,
      currentValue: { color, brushSize },
    } = value['configs'];
    if (previousValue) {
      this.context.strokeStyle = color;
      this.context.lineWidth = brushSize;
      this.canvasSocketService.sendConfigs({
        color,
        brushSize,
      });
    }
  }
  ngOnInit() {
    this.canvasSocketService.message$.subscribe((data: any) => {
      if (data.type === 'connect') {
      } else if (data.type === 'beginDraw') {
        const { x, y } = data.message;
        this.beginDraw(x, y);
      } else if (data.type === 'lineDraw') {
        const { x, y } = data.message;
        this.lineDraw(x, y);
      } else if (data.type === 'reset') {
        this.canvasReset();
      } else if (data.type === 'configs') {
        const { color, brushSize } = data.message;
        this.context.strokeStyle = color;
        this.context.lineWidth = brushSize;
      }
    });
    this.canvasService.canvasSubscribe().subscribe((data: any) => {
      if (data.type === 'clear') {
        this.canvasReset();
        this.canvasSocketService.sendCanvasReset();
        this.canvasService.drawHistory.length = 0;
        this.canvasService.pointerValue = 0;
      } else if (data.type === 'undo' || data.type === 'redo') {
        const imageData =
          this.canvasService.drawHistory[this.canvasService.pointerValue];
        this.context.putImageData(imageData, 0, 0);
      }
    });
    this.context = this.el.nativeElement.getContext('2d');
    this.context.lineCap = 'round';
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 1;
    this.context.canvas.height = window.innerHeight - 56;
    this.context.canvas.width = window.innerWidth - 365;
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    this.isStarted = true;
    this.beginDraw(event.offsetX, event.offsetY);
    this.canvasSocketService.sendBeginDraw({
      x: event.offsetX,
      y: event.offsetY,
    });
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isStarted) {
      //console.log(event.clientX, event.clientY, event.offsetX, event.offsetY);
      this.lineDraw(event.offsetX, event.offsetY);
      this.canvasSocketService.sendLineDraw({
        x: event.offsetX,
        y: event.offsetY,
      });
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    const imageData = this.context.getImageData(
      0,
      0,
      window.innerWidth - 365,
      window.innerHeight - 56
    );
    this.canvasService.drawHistory.push(imageData);
    this.canvasService.pointerValue = this.canvasService.drawHistory.length - 1;
    this.isStarted = false;
  }

  // @HostListener('touchstart', ['$event']) onTouchDown(event: any) {
  //   this.isStarted = true;
  //   this.beginDraw(event.offsetX, event.offsetY);
  //   this.canvasSocketService.sendBeginDraw({
  //     x: event.offsetX,
  //     y: event.offsetY,
  //   });
  // }

  // @HostListener('touchmove', ['$event']) onTouchMove(event: any) {
  //   if (this.isStarted) {
  //     //console.log(event.clientX, event.clientY, event.offsetX, event.offsetY);
  //     this.lineDraw(event.offsetX, event.offsetY);
  //     this.canvasSocketService.sendLineDraw({
  //       x: event.offsetX,
  //       y: event.offsetY,
  //     });
  //   }
  // }

  // @HostListener('touchend', ['$event']) onTouchUp(event: any) {
  //   const imageData = this.context.getImageData(0, 0, 600, 600);
  //   this.canvasService.drawHistory.push(imageData);
  //   this.canvasService.pointerValue = this.canvasService.drawHistory.length - 1;
  //   this.isStarted = false;
  // }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.isStarted = false;
    const imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.canvas.height = window.innerHeight - 56;
    this.context.canvas.width = window.innerWidth - 365;
    this.context.putImageData(imageData, 0, 0);
  }

  beginDraw(x: number, y: number) {
    this.context.beginPath();
    this.context.moveTo(x, y);
  }

  lineDraw(x: number, y: number) {
    this.context.lineTo(x, y);
    this.context.stroke();
  }

  canvasReset() {
    this.context.canvas.height = window.innerHeight - 56;
    this.context.canvas.width = window.innerWidth - 365;
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 1;
    this.canvasService.drawHistory.length = 0;
    this.canvasService.pointerValue = 0;
  }
}
