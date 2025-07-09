import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cos-initials',
  template: `{{initials}}`,
  styleUrls: ['./cos-initials.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CosInitialsComponent implements OnInit {

  @Input() name: string = '';
  @Input() initialLimit: number = 2;
  initials = '';
  constructor() { }


  ngOnInit(): void {
    const parts = this.name.split(/\s+/);
    if (parts.length === 1 || this.initialLimit === 1) {
        this.initials = parts[0][0].toUpperCase();
    } else if (parts.length > 1) {
        this.initials = parts[0][0].toUpperCase() + parts.slice(-1)[0][0].toUpperCase();
    }
  }

}
