import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../interfaces/group';
import { Topic } from '../interfaces/topic';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  showHelp = new BehaviorSubject(false);
  group: Group | undefined;
  topic: Topic | undefined;
  constructor() { }
}
