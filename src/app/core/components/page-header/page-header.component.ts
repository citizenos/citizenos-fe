import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  constructor(
    public auth: AuthService,
    public app: AppService,
    public translate: TranslateService) {

  }
}
