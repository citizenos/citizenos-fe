import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

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
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  svg?:any;
  constructor (public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:ConfirmDialogData, private sanitized: DomSanitizer) {
    if (!data.level) data.level = 'warn';
    if (data.svg) {
      this.svg = this.sanitized.bypassSecurityTrustHtml(data.svg);
    }
  }

  ngOnInit(): void {
  }

}
