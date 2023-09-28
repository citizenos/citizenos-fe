import { Router } from '@angular/router';
import { Component, Input, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'feature-box',
  templateUrl: './feature-box.component.html',
  styleUrls: ['./feature-box.component.scss']
})
export class FeatureBoxComponent {
  @Input() feature!:string;
  @Input() items!: number;
  @Input() icon!: string;

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
      this.router.navigate(['/', this.translate.currentLang, 'topics', 'create'])
    }
  }
}
