import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';
import { SOUND } from '../data/enums';
import { ISound } from '../data/interfaces';


@Injectable({
  providedIn: 'root'
})
export class SoundService implements ISound {

  private beep: Howl;
  constructor() {
    this.beep = new Howl({
      src: ['assets/sounds/all.mp3'],
      sprite: {
        tick: [0, 130],
        whistle: [160, 1300],
        button: [1420, 1540]
      }
    });
    Howler.volume(1.0);
  }
  playSound(sound: SOUND) {
    this.beep.play(sound);
  }
}
