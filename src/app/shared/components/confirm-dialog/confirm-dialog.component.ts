import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

export interface ConfirmDialogData {
  title: string | null,
  heading: string | null,
  level: string,
  closeBtn: string | null,
  confirmBtn: string | null,
  sections: any | null,
  info: string | null,
  description: string | null,
  points: string[] | null,
  svg: string | null
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent implements OnInit {

  svg?:any;
  constructor (@Inject(DIALOG_DATA) public data:ConfirmDialogData, private sanitized: DomSanitizer, dialog: DialogRef<ConfirmDialogComponent>) {
    if (!data.level) data.level = 'warn';
    if (data.svg) {
      this.svg = this.sanitized.bypassSecurityTrustHtml(data.svg);
    }
  }

  ngOnInit(): void {
  }

}
