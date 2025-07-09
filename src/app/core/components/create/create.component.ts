import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '@services/app.service';

@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: false
})
export class CreateComponent {
  constructor (public translate: TranslateService, public app: AppService) {

  }
}
