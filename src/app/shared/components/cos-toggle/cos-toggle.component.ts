import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cos-toggle',
  templateUrl: './cos-toggle.component.html',
  styleUrls: ['./cos-toggle.component.scss']
})

export class CosToggleComponent implements OnInit {
  @Input() model:any = '';
  @Output() modelChange:any = new EventEmitter<any>();
  @Input() value:any = '';
  @Input() offValue:any = '';
  @Input() cosToggleTextOn:any = '';
  @Input() cosToggleTextOff:any = '';
  @Input() cosToggleDatepickerToggle:any = '';

  constructor() {
  }

  ngOnInit(): void {
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
