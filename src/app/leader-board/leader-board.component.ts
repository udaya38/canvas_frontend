import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CanvasSocketServiceService } from '../services/canvas-socket-service.service';
import { RoomData } from '../DTO/room-data.model';
import { WordPickerComponent } from '../word-picker/word-picker.component';
import { MatDialog } from '@angular/material/dialog';
import { WORD_LIST } from '../Constant/words';
import { FinalScoreComponent } from '../final-score/final-score.component';
@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss'],
})
export class LeaderBoardComponent {
  messageValue: string = '';
  messageList: any[] = [];
  @Input('isGameTriggered') isGameTriggered: boolean = false;
  @ViewChild('messageRef')
  messageRef!: ElementRef;
  selectedWord: string = '#';
  constructor(
    private socketService: CanvasSocketServiceService,
    public userDetails: RoomData,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.socketService.message$.subscribe((data) => {
      if (data.type === 'word') {
        this.messageList.push(data.details);
      } else if (data.type === 'room') {
        this.userDetails.usersList = data.details?.users.map((e: any) => {
          return {
            userName: e,
            score: 0,
            chance: 0,
          };
        });

        // this.messageList.push(
        //   ...data.details?.users
        //     ?.filter((e: any) => this.userDetails.userName !== e)
        //     .map((e: any) => {
        //       return {
        //         userName: e,
        //       };
        //     })
        // );
        if (this.userDetails.userName !== data.details?.userName) {
          this.messageList.push({
            userName: data.details?.userName,
          });
        }
      }
    });

    this.socketService.wordsListner$.subscribe((data) => {
      if (data.type === 'selectedword') {
        this.selectedWord = data.details.word;
      } else if (data.type === 'nextuser') {
        this.userDetails.usersList = data.details.usersList;
        if (this.userDetails.userName === data.details?.nextuser.userName) {
          this.gameStart();
        }
      } else if (data.type === 'game-end') {
        this.dialog.open(FinalScoreComponent, {
          data: this.userDetails.usersList,
        });
      }
    });
  }

  ngOnChanges() {
    if (this.isGameTriggered) {
      this.gameStart();
    }
  }

  gameStart() {
    this.socketService.choosingWord();
    this.openWordPicker();
  }
  ngAfterViewChecked() {
    this.messageRef.nativeElement.scrollTop =
      this.messageRef.nativeElement.scrollHeight;
  }
  sendMessage() {
    //this.messageList.push(this.messageValue);
    if (this.messageValue.toLowerCase() === this.selectedWord.toLowerCase()) {
      this.socketService.wordsListner$.next({
        type: 'show',
      });
      this.messageValue = `${this.userDetails.userName} guessed the word correctly`;
      const scoreDetails = this.userDetails.usersList.map((e: any) => {
        if (e.userName === this.userDetails.userName) {
          return {
            userName: e.userName,
            score: e.score + this.userDetails.timerState * Math.floor(100 / 60),
            chance: e.chance,
          };
        }
        return {
          userName: e.userName,
          score: e.score,
          chance: e.chance,
        };
      });
      this.socketService.sendScoreDetails(scoreDetails);
    }
    this.socketService.sendWordMessage(this.messageValue);
    this.messageValue = '';
  }

  openWordPicker(): void {
    const dialogRef = this.dialog.open(WordPickerComponent, {
      data: {
        words: WORD_LIST.map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value)
          .slice(0, 4),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Do something with the selected word
        this.socketService.wordsListner$.next({
          type: 'selected',
          word: result.toLowerCase(),
        });
      } else {
        this.socketService.sendCanvasReset();
        this.userDetails.usersList.forEach((e: any) => {
          if (e.userName === this.userDetails.userName) {
            e.chance = 1;
          }
        });
        const nextuser = this.userDetails.usersList.find(
          (e: any) => e.chance === 0
        );
        if (!nextuser) {
          this.socketService.gameEnd();
          this.dialog.open(FinalScoreComponent, {
            data: this.userDetails.usersList,
          });
          return;
        }
        this.socketService.sendToNextUser({
          nextuser,
        });
      }
    });
  }
}
