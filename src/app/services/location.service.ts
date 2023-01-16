import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private location: Location, private PlatformLocation: PlatformLocation, private router: Router, private config: ConfigService) { }

  getBaseUrl() {
    let port;
    if (this.PlatformLocation.protocol === 'https' && this.PlatformLocation.port !== '443') {
      port = this.PlatformLocation.port;
    }

    if (this.PlatformLocation.protocol === 'http' && this.PlatformLocation.port !== '80') {
      port = this.PlatformLocation.port;
    }

    return this.PlatformLocation.protocol + "//" + this.PlatformLocation.hostname + (port ? ':' + port : '');
  };

  /**
   * Get absolute url for API call
   *
   * @param {string} path /some/path/:param1
   * @param {Object} [params] An object containing properties mapped to the named route "parameters".
   * @param {Object} [query] An object containing a property for each query string parameter in the route.
   */

  getAbsoluteUrlApi(path: string, params?: any, query?: any) {
    const baseUrlApi = this.config.get('api')['baseUrl'];

    return this._getAbsoluteUrl(baseUrlApi, path, params, query);
  };

  getAbsoluteUrlEtherpad(path: string, params?: any, query?: any) {
    const baseUrlEtherpad = this.config.get('etherpad')['baseUrl'];

    return this._getAbsoluteUrl(baseUrlEtherpad, path, params, query);
  };

  getAbsoluteUrl(path: string, params?: any, query?: any) {
    const baseUrlApi = this.getBaseUrl();
    console.log(baseUrlApi)
    return this._getAbsoluteUrl(baseUrlApi, path, params, query);
  };

  currentUrl() {
    const baseUrl = this.getBaseUrl();
    return baseUrl + this.location.path();
  };

  _getAbsoluteUrl(baseUrl: string, path: string, params?: any, query?: any) {

    if (params) {
      Object.keys(params).forEach((key) => {
        path = path.replace(':' + key, params[key]);
      });
    }

    let queryString = '';
    if (query) {
      Object.keys(query).forEach((key) => {
        queryString += key + '=' + encodeURIComponent(query[key]) + '&';
      });
      if (queryString.length) {
        queryString = '?' + queryString.slice(0, -1);
      }
    }

    return baseUrl + path + queryString;
  }
}
