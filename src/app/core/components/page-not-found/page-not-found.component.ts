import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/account/components/login/login.component';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private dialog: MatDialog, public app: AppService, private Auth: AuthService) { }

  ngOnInit(): void {
  }

  doShowLogin() {
    this.dialog.closeAll();
    this.dialog.open(LoginComponent);
  }
  
  loggedIn() {
    return this.Auth.loggedIn$.value;
  }
}
