import { Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-accessibility-menu',
  templateUrl: './accessibility-menu.component.html',
  styleUrls: ['./accessibility-menu.component.scss']
})
export class AccessibilityMenuComponent {

  constructor (public app: AppService) {}

  setContrast (contrast: string) {
    const accessibilityClasses = this.app.accessibility.value;
    accessibilityClasses.contrast = contrast;
    this.app.accessibility.next(accessibilityClasses);
  }

  setTextSize (size: string) {
    const accessibilityClasses = this.app.accessibility.value;
    accessibilityClasses.text = size;
    this.app.accessibility.next(accessibilityClasses);
  }
}
