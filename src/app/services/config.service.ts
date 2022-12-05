import { Injectable, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'; //path to your environment files

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    private _config: any = {}
    private _env: string = 'development';

    constructor(private _http: HttpClient) { }
    load() {
      return new Promise ((resolve, reject ) => {

      if (environment.production)
        this._env = 'production';
      this._http.get('./assets/config/' + this._env + '.json')
          .subscribe({
            next: (data) => {
              this._config = data;

              resolve(data);
            },
            error: (error: any) => {
                console.error(error);
                reject(error);
            }
          });
      });
    }

    // Is app in the development mode?
    isDevmode() {
        return this._env === 'development';
    }

    // Gets a value of specified property in the configuration file
    get(key: any) {
        return this._config[key];
    }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.load();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ConfigModule = {
    init: init
}

export { ConfigModule };
