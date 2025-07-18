import { Component, OnInit } from '@angular/core';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'page-unauthorized',
  templateUrl: './page-unauthorized.component.html',
  styleUrls: ['./page-unauthorized.component.scss'],
  standalone: false
})
export class PageUnauthorizedComponent implements OnInit {

  constructor(public app: AppService, private Auth: AuthService) { }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.Auth.loggedIn$.value;
  }

}
