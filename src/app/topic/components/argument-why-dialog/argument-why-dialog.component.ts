import { Component, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Argument } from 'src/app/interfaces/argument';

@Component({
  selector: 'app-argument-why-dialog',
  templateUrl: './argument-why-dialog.component.html',
  styleUrls: ['./argument-why-dialog.component.scss']
})
export class ArgumentWhyDialogComponent {
  @Input() argument!: Argument;

  constructor (@Inject(MAT_DIALOG_DATA) data: any) {
    this.argument = data.argument;
  }
}
