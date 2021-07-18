import { ConfigurationService } from '../services/configuration.service';
import { SOUND, STATE } from './enums';

export interface ICountdownState {
  state: STATE;
}

export interface ISettings {
  configuration: ConfigurationService;
 }

 export interface IPreset {
   presentation: number;
   qanda: number;
   description: string;

 }

 export interface ISound {
  playSound(sound: SOUND);
}

export interface IConfigurationService {
  presentation: number;
  questionsAndAnswers: number;
}
