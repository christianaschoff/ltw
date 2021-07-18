import { Injectable } from '@angular/core';
import { TIMERDIRECTION } from './enums';

@Injectable()
export class Presentation {
  presentation: number;
  qanda: number;
  timerDirection: TIMERDIRECTION;
  currentTimer: number;
  constructor(presentation: number, qanda: number) {
    this.presentation = presentation;
    this.qanda = qanda;
    this.timerDirection = TIMERDIRECTION.PRESENTATION;
    this.currentTimer = 0;
  }
}
