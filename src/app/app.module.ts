import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { CanvasComponent } from './canvas/canvas.component';
import { AppCanvasListnerDirective } from './directives/app-canvas-listner.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateRoomComponent } from './create-room/create-room.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WordPickerComponent } from './word-picker/word-picker.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ScoreBoardComponent } from './score-board/score-board.component';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import { FinalScoreComponent } from './final-score/final-score.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeaderBoardComponent,
    CanvasComponent,
    AppCanvasListnerDirective,
    CreateRoomComponent,
    WordPickerComponent,
    ScoreBoardComponent,
    FinalScoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
