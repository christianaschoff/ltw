import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ConfigurationService } from './configuration.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IConfigurationService } from '../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(protected localStorage: LocalStorage,
              private readonly configService: ConfigurationService) { }

  saveData(data: IConfigurationService) {
    this.localStorage.setItem('data', data).subscribe((x) => {
    });
  }

  loadData(): Observable<IConfigurationService> {
    console.log('load');

    return this.localStorage.getItem('data').pipe(
      map((data) => {
        const configuration = data as IConfigurationService;
        console.log('store', configuration);
        if (configuration === undefined || configuration === null) {
          return this.configService;
        }
        console.log(configuration);
        return configuration;
      }),
      catchError((err, caught) => {
        console.log('err', err);
        return of(this.configService);
      })
    );
  }
  deleteData() {
    this.localStorage.removeItem('data').subscribe(() => {});
  }
}
