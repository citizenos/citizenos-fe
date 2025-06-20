import { Component } from '@angular/core';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: false
})
export class PasswordResetComponent {

  constructor() { }

}

@Component({
  templateUrl: './password-reset-dialog.component.html',
  standalone: false
})
export class PasswordResetDialogComponent {
  constructor() {
  }
}
