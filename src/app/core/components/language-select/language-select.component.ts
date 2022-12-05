import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageSelectComponent implements OnInit {
  languages$: {[key: string]: any} = this.config.get('language').list;

  constructor(public translate: TranslateService, public config: ConfigService, private router: Router) {
  }

  ngOnInit(): void {
  }

  doSwitchLanguage (lang: string) {
    this.router.navigateByUrl(this.router.url.replace(`/${this.translate.currentLang}/`, `/${lang}/`));
  }
}
