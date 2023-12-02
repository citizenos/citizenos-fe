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

  add(level: string, message: string, title?: string) {
    if (this.messages[level].indexOf(message) === -1) {
      this.messages[level].push({message, title});
    }
    window.scrollTo(0, 0);
  };

  removeAll(level?: string) {
    if (level) {
      this.messages[level] = [];
    } else {
      this.init();
    }
  };

  addSuccess(message: string,  title?: string) {
    this.add(this.levels['SUCCESS'], message, title);
  };

  addInfo(message: string,  title?: string) {
    this.add(this.levels['INFO'], message, title);
  };

  addError(message: string,  title?: string) {
    this.add(this.levels['ERROR'], message, title);
  };

  addWarning(message: string,  title?: string) {
    this.add(this.levels['WARNING'], message, title);
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
