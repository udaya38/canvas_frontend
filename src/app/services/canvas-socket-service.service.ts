import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { RoomData } from '../DTO/room-data.model';
@Injectable({
  providedIn: 'root',
})
export class CanvasSocketServiceService {
  public message$: Subject<any> = new Subject();
  public wordsListner$: Subject<any> = new Subject();
  constructor(private model: RoomData) {
    this.initConnection();
  }
  //https://canvas-draw-server.onrender.com
  socket = io('https://canvas-draw-server.onrender.com');

  initConnection() {
    this.socket.on('connect', () => {
      this.message$.next({
        type: 'connect',
        message: this.socket.id,
      });
    });
    this.socket.on('beginDraw', (message) => {
      this.message$.next({
        type: 'beginDraw',
        message,
      });
    });
    this.socket.on('lineDraw', (message) => {
      this.message$.next({
        type: 'lineDraw',
        message,
      });
    });
    this.socket.on('canvasReset', () => {
      this.message$.next({
        type: 'reset',
        message: '',
      });
    });
    this.socket.on('configs', (message) => {
      this.message$.next({
        type: 'configs',
        message,
      });
    });
    this.socket.on('word-list', (details, isChoosing) => {
      if (isChoosing) {
        this.wordsListner$.next({
          type: 'choose',
          details,
        });
      }
      this.message$.next({
        type: 'word',
        details,
      });
    });
    this.socket.on('selected-word', (details) => {
      this.wordsListner$.next({
        type: 'selectedword',
        details,
      });
    });

    this.socket.on('score-details', (details) => {
      this.message$.next({
        type: 'scoredetails',
        details,
      });
    });

    this.socket.on('next-user', (details) => {
      this.wordsListner$.next({
        type: 'nextuser',
        details,
      });
    });

    this.socket.on('reload', (details) => {
      this.wordsListner$.next({
        type: 'reload',
        details,
      });
    });

    this.socket.on('game-end', (details) => {
      this.wordsListner$.next({
        type: 'game-end',
        details,
      });
    });

    this.socket.on('join-room', (details) => {
      this.message$.next({
        type: 'room',
        details,
      });
    });

    this.joinRoom();
  }
  public sendBeginDraw(message: any) {
    this.socket.emit('beginDraw', message, this.model);
  }

  public sendLineDraw(message: any) {
    this.socket.emit('lineDraw', message, this.model);
  }

  public sendCanvasReset() {
    this.socket.emit('canvasReset', this.model);
  }

  public sendConfigs(message: any) {
    this.socket.emit('configs', message, this.model);
  }

  //Message listeners
  public sendWordMessage(word: any) {
    this.socket.emit('word-list', word, this.model);
  }

  public choosingWord() {
    this.socket.emit('user-choosing', this.model);
  }

  public joinRoom() {
    this.socket.emit('join-room', this.model);
  }

  public sendSelectedWord(word: string) {
    this.socket.emit('selected-word', { ...this.model, word });
  }

  public sendScoreDetails(scoreDetails: any) {
    this.socket.emit('score-details', { ...this.model, scoreDetails });
  }

  public sendToNextUser(list: any) {
    this.socket.emit('next-user', { ...this.model, ...list });
  }

  public sendReload(value: boolean) {
    this.socket.emit('reload', { ...this.model, value });
  }

  public gameEnd() {
    this.socket.emit('game-end', { ...this.model });
  }
}
