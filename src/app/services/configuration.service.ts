import { Injectable } from '@angular/core';
import { IConfigurationService } from '../data/interfaces';



@Injectable({
  providedIn: 'root'
})
export class ConfigurationService implements IConfigurationService {
  presentation: number;
  questionsAndAnswers: number;

  constructor() {
    this.presentation = 420;
    this.questionsAndAnswers = 180;
  }
}
