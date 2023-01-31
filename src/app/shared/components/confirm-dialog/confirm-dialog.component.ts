import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor (public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:ConfirmDialogData) {
    if (!data.level) data.level = 'warn';
  }

  ngOnInit(): void {
  }

}
