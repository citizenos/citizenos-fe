import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from 'src/app/shared/dialog';

@Component({
  selector: 'app-est-id-login',
  templateUrl: './est-id-login.component.html',
  styleUrls: ['./est-id-login.component.scss'],
  standalone: false
})

export class EstIdLoginComponent {

}

@Component({
  templateUrl: './est-id-login-dialog.component.html',
  styleUrls: ['./est-id-login-dialog.component.scss'],
  standalone: false
})
export class EstIdLoginDialogComponent {

  constructor(@Inject(DIALOG_DATA) public data:any) {

  }
}
