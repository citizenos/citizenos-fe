import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor () {}
}


@Component({
  templateUrl: './login-dialog.component.html'
})
export class LoginDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
