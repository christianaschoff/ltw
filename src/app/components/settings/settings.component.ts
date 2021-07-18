import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { IPreset, ISettings } from '../../data/interfaces';
import { MinuteSecondsPipe } from '../../pipes/MinuteSecondsPipe';
import { StorageService } from '../../services/storage.service';

@Injectable()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  tickPresentation$: Observable<number>;
  tickQaA$: Observable<number>;
  presets: IPreset[] = [ {presentation: 420, qanda: 180, description: 'Presentation: 07:00 + Q&A: 03:00'},
                          {presentation: 600, qanda: 300, description: 'Presentation: 10:00 + Q&A: 05:00'},
                          {presentation: 1500, qanda: 300, description: 'Presentation: 25:00 + Q&A: 05:00'},
                          {presentation: 2700, qanda: 900, description: 'Presentation: 45:00 + Q&A: 15:00'},
                          {presentation: 3300, qanda: 300, description: 'Presentation: 55:00 + Q&A: 05:00'}
                        ];

  constructor(public dialogRef: MatDialogRef<SettingsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ISettings,
              private readonly storage: StorageService) {

              this.tickPresentation$ = of(this.data.configuration.presentation);
              this.tickQaA$ = of(this.data.configuration.questionsAndAnswers);
  }

  presentationChange(value: number) {
    this.tickPresentation$ = of(value);
  }

  qaaChange(value: number) {
    this.tickQaA$ = of(value);
  }

  handleSelection(event, v) {
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);

      let selectedElement: any;
      for (const a of v) {
        const elem = a._element.nativeElement.outerText;
        selectedElement = this.presets.filter(x => x.description === elem);
      }

      const selection = selectedElement[0] as IPreset;
      if (selection === undefined) {
        return;
      }

      this.tickPresentation$ = of(selection.presentation);
      this.tickQaA$ = of(selection.qanda);
    }
  }

  gatherDataAndCloseDialog() {
    let retPresentation: number;
    let retQaA: number;

    this.tickPresentation$.subscribe(presentation => retPresentation = presentation);
    this.tickQaA$.subscribe(qaa => retQaA = qaa);

    const data =  {
      presentation: retPresentation,
      questionsAndAnswers: retQaA
    };
    this.storage.saveData(data);
    return data;
  }

  formatSliderValue(value: number | null) {
    if (!value) {
      return '0:00';
    }
    return new MinuteSecondsPipe().transform(value);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
}
