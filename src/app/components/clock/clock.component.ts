import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROGRESSCOLOR, SOUND, STATE, TIMERDIRECTION } from '../../data/enums';

import { IConfigurationService, ICountdownState } from '../../data/interfaces';
import { Presentation } from '../../data/presentation';
import { SoundService } from '../../services/sound.service';
import { StorageService } from '../../services/storage.service';
import { SettingsComponent } from '../settings/settings.component';


@Injectable()
@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

  countdown: ICountdownState;
  configuration: IConfigurationService;
  tick$: Observable<number>;
  percentage$: Observable<number>;
  displayRTL$: Observable<boolean>;
  progressColor$: Observable<string>;
  currentPresentation: Presentation;
  display: HTMLElement;

  private rtlViewDirection = false;

  constructor(private readonly soundplayer: SoundService,
              private readonly settingsDialog: MatDialog,
              private readonly storage: StorageService) {
                this.configuration = {presentation: 420, questionsAndAnswers: 180};
                this.tick$ = of(this.configuration.presentation);
                this.rtlViewDirection = false;
                this.displayRTL$ = of(this.rtlViewDirection);
              }

  ngOnInit() {
    this.storage.loadData().subscribe(erg => {
      console.log('init');
      this.configuration = erg;
      this.tick$ = of(this.configuration.presentation);
    });
    this.switchProgress(PROGRESSCOLOR.PRESENTATION);
    this.countdown = {state: STATE.STOP};
    interval(1000).subscribe( x => this.timerLoop());
    this.display = document.getElementById('timerDisplay');
  }

start() {
  console.log('start');
  this.soundplayer.playSound(SOUND.BUTTON);
  if (this.countdown.state !== STATE.PAUSE) {
      this.currentPresentation = new Presentation(this.configuration.presentation, 0);
      this.switchStyle(this.display, false);
      this.switchProgress(PROGRESSCOLOR.PRESENTATION);
      this.calculatePercentage(this.currentPresentation);
  }
  this.countdown = {state: STATE.RUN};
}

stop() {
  console.log('stop');
  this.soundplayer.playSound(SOUND.BUTTON);
  this.countdown = {state: STATE.STOP};
  this.switchStyle(this.display, false);
  if (this.currentPresentation) {
    this.currentPresentation.currentTimer = 0;
    this.calculatePercentage(this.currentPresentation);
  }
  this.switchProgress(PROGRESSCOLOR.PRESENTATION);
}

pause() {
  console.log('pause');
  this.soundplayer.playSound(SOUND.BUTTON);
  this.countdown = {state: STATE.PAUSE};
}

swapDirection() {
  this.rtlViewDirection = !this.rtlViewDirection;
  this.displayRTL$ = of(this.rtlViewDirection);

  this.displayRTL$.pipe(map((x) => console.log(x)));
}

settings() {
   const dialogRef = this.settingsDialog.open(SettingsComponent, { width: '80%',
  data: { configuration: this.configuration } });
   dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
      return;
      }

      console.log('new settings');
      if (this.countdown.state === STATE.RUN || this.countdown.state === STATE.PAUSE) {
          this.stop();
      }
      this.configuration = result;
   });
}

private timerLoop() {
    let currentValue: number;
    this.tick$.subscribe(x => currentValue = x);

    switch (this.countdown.state) {
      case STATE.RUN:
          this.currentPresentation.currentTimer = currentValue;
          this.currentPresentation = this.calculateTime(this.currentPresentation);
          this.calculatePercentage(this.currentPresentation);
          currentValue = this.currentPresentation.currentTimer;
          break;
        case STATE.STOP:
          currentValue = this.configuration.presentation;
          break;
      default:
        return;
    }
    this.tick$ = of(currentValue);
  }

  private calculatePercentage(currentPresentation: Presentation) {

     if (currentPresentation.currentTimer === 0) {
      this.percentage$ = of(0);
       return;
     }

     if (currentPresentation.currentTimer % 5 === 0) {
      const base = currentPresentation.timerDirection === TIMERDIRECTION.PRESENTATION
                  ? this.configuration.presentation
                  : this.configuration.questionsAndAnswers;

      const calcValue = currentPresentation.timerDirection === TIMERDIRECTION.PRESENTATION
            ? base - currentPresentation.currentTimer
            : currentPresentation.currentTimer;

      const perc = (calcValue / base) * 100;

      if (perc > 85 && currentPresentation.timerDirection === TIMERDIRECTION.PRESENTATION) {
        this.switchProgress(PROGRESSCOLOR.PRESENTATION_WARNING);
      }
      this.percentage$ = of(perc);
     }
  }

  private calculateTime(currentPresentation: Presentation): Presentation {

    let returnValue = 0;

    if (currentPresentation.timerDirection === TIMERDIRECTION.QUESTIONSANDANSWERS) {
      currentPresentation.qanda += 1;
      const rest = this.configuration.questionsAndAnswers - currentPresentation.qanda;
      if (rest <= 5 && rest > 0) {
        this.soundplayer.playSound(SOUND.BEEP);
      } else if (rest === 0) {
        this.soundplayer.playSound(SOUND.WHISTLE);
      }
      returnValue = currentPresentation.qanda;

    } else if (currentPresentation.timerDirection === TIMERDIRECTION.PRESENTATION) {
       currentPresentation.presentation -= 1;

       if (currentPresentation.presentation <= 5 && currentPresentation.presentation > 0) {
         this.soundplayer.playSound(SOUND.BEEP);
       } else if (currentPresentation.presentation === 0) {
          currentPresentation.timerDirection = TIMERDIRECTION.QUESTIONSANDANSWERS;
          this.switchStyle(this.display, true);
          this.switchProgress(PROGRESSCOLOR.QUESTIONSANDANSWERS);
          this.soundplayer.playSound(SOUND.WHISTLE);
       }
       returnValue = currentPresentation.presentation;
    }

    currentPresentation.currentTimer = returnValue;
    return currentPresentation;
  }

  private switchProgress(progressColor: PROGRESSCOLOR) {
   let progresscolor: string;
   switch (progressColor) {
     case PROGRESSCOLOR.PRESENTATION_WARNING:
        progresscolor = 'accent';
        break;
    case PROGRESSCOLOR.QUESTIONSANDANSWERS:
        progresscolor = 'warn';
        break;
     default:
       progresscolor = 'primary';
   }
   this.progressColor$ = of(progresscolor);
  }

  private switchStyle(uiElement: HTMLElement, turnRed: boolean) {
    if (uiElement === undefined) {
      return;
    }

    if (turnRed) {
      uiElement.classList.remove('presentation');
      uiElement.classList.add('qanda');
    } else {
      uiElement.classList.remove('qanda');
      uiElement.classList.add('presentation');
    }
  }
}
