import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showHelp = new BehaviorSubject(false);
  constructor() { }
}
