import { Component, OnInit, Inject } from '@angular/core';

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
  constructor() {
  }
}
