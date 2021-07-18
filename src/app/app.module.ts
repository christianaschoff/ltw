import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ClockComponent } from './components/clock/clock.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MinuteSecondsPipe } from './pipes/MinuteSecondsPipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Hammer from 'hammerjs';


@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    SettingsComponent,
    MinuteSecondsPipe
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSliderModule,
    MatExpansionModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
