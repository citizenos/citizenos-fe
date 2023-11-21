import { Router } from '@angular/router';
import { Component, Input, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from 'src/app/services/location.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'feature-box',
  templateUrl: './feature-box.component.html',
  styleUrls: ['./feature-box.component.scss']
})
export class FeatureBoxComponent {
  @Input() feature!:string;
  @Input() items!: number;
  @Input() icon!: string;

  private app = inject(AppService);
  private auth = inject(AuthService);
  private Location = inject(LocationService);

  router = inject(Router);
  translate = inject(TranslateService);

  itemsList () {
    let items = [];
    let i = 0;
    while (i < this.items) {
      items.push(i);
      i++;
    }
    return items;
  }

  btnClick () {
    if (this.feature === 'discussion') {
      if (!this.auth.loggedIn$.value) {
        return this.app.doShowLogin(this.Location.getAbsoluteUrl(this.router.createUrlTree(['/', this.translate.currentLang, 'topics', 'create']).toString()));
      }
      this.router.navigate(['/', this.translate.currentLang, 'topics', 'create'])
    }
    if (this.feature === 'voting') {
      if (!this.auth.loggedIn$.value) {
        return this.app.doShowLogin(this.Location.getAbsoluteUrl(this.router.createUrlTree(['/', this.translate.currentLang, 'topics', 'vote', 'create']).toString()));
      }
      this.router.navigate(['/', this.translate.currentLang, 'topics', 'vote', 'create'])
    }
  }
}
