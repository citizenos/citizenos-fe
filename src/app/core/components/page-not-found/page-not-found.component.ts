import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(public app: AppService, private Auth: AuthService) { }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.Auth.loggedIn$.value;
  }
}
