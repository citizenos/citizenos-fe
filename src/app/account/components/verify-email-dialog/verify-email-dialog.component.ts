import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from 'src/app/shared/dialog';

@Component({
  selector: 'app-verify-email-dialog',
  templateUrl: './verify-email-dialog.component.html',
  styleUrls: ['./verify-email-dialog.component.scss']
})
export class VerifyEmailDialogComponent {

  constructor(@Inject(DIALOG_DATA) public data: any) {

  }
}
