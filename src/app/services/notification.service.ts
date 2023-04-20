import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public levels: { [key: string]: string } = {
    SUCCESS: 'success',
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning'
  };
  dialog: any = null;

  public messages: any = {
    error: [],
    info: [],
    success: [],
    warning: []
  };

  constructor() { }

  // FYI: One should never access this directly, but via functions.
  // At this point I have no idea how to make the object and its properties read-only.


  private init = () => {
    Object.keys(this.levels).forEach((key) => {
      this.messages[this.levels[key]] = [];
    });
    this.dialog = null;
  };

  add(level: string, key: string) {
    if (this.messages[level].indexOf(key) === -1) {
      this.messages[level].push(key);
    }
  };

  removeAll(level?: string) {
    if (level) {
      this.messages[level] = [];
    } else {
      this.init();
    }
  };

  addSuccess(key: string) {
    this.add(this.levels['SUCCESS'], key);
  };

  addInfo(key: string) {
    this.add(this.levels['INFO'], key);
  };

  addError(key: string) {
    this.add(this.levels['ERROR'], key);
  };

  addWarning(key: string) {
    this.add(this.levels['WARNING'], key);
  };

  showDialog(heading: string, content: string) {
    this.dialog = {
      heading: heading,
      content: content
    }
  };

  inline(text: string, X: number, Y: number) {
    const el = document.createElement("div");
    el.className = 'inline-message';
    el.innerText = text;
    el.style.left = X + 'px';
    el.style.top = Y + 'px';

    document.body.appendChild(el);
    setTimeout(() => {
      el.classList.add('no-opacity');
    }, 300);

    setTimeout(() => {
      el.remove();
    }, 1000);
  };
}
