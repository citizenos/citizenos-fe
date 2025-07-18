import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cos-toggle',
  templateUrl: './cos-toggle.component.html',
  styleUrls: ['./cos-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule]
})

export class CosToggleComponent {
  @Input() model:any = '';
  @Output() modelChange:any = new EventEmitter<any>();
  @Input() value:any = '';
  @Input() offValue:any = '';
  @Input() cosToggleTextOn:any = '';
  @Input() cosToggleTextOff:any = '';
  @Input() cosToggleDatepickerToggle:any = '';

  constructor() {
  }

  cosToggle() {
    if (this.value) {
      if (this.model === this.value && this.offValue) {
        this.model = this.offValue;
      } else {
        this.model = this.value;
      }
    } else {
      this.model = !this.model;
    }
    console.log('CHANGE', this.model);
    this.modelChange.emit(this.model);
  };

  isEnabled() {
    if (this.value && this.model === this.value) {
      return true;
    } else if (this.value && this.model != this.value) {
      return false;
    } else if (!this.model) {
      return false;
    }

    return true
  }
}
