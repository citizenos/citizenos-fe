import { Component } from '@angular/core';
import { AppService } from '@services/app.service';

@Component({
  selector: 'accessibility-menu',
  templateUrl: './accessibility-menu.component.html',
  styleUrls: ['./accessibility-menu.component.scss'],
  standalone: false
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
