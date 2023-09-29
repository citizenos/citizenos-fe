import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor() { }
}


@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  private authSubscriber: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, dialog: MatDialogRef<LoginDialogComponent>, auth: AuthService) {
    console.log('LOGINDIALOG', data)
    this.authSubscriber = auth.loggedIn$.subscribe({
      next: (value) => {
        if (value) {
          dialog.close()
        }
      }
    });
  }

  ngOnDestroy():void {
    this.authSubscriber.unsubscribe();
  }
}
