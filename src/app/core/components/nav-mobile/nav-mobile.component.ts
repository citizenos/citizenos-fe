import { Component, OnInit } from '@angular/core';
import { PRIMARY_OUTLET, Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/interfaces/topic';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.scss']
})
export class NavMobileComponent implements OnInit {

  constructor(private translate: TranslateService, public app: AppService, private Auth: AuthService, private TopicService: TopicService, private router: Router, private route: ActivatedRoute) {
    console.log(translate)
  }

  canEdit(topic: Topic) {
    return this.TopicService.canEdit(topic);
  }

  ngOnInit(): void {
  }

  loggedIn () {
    return this.Auth.loggedIn$;
  }

  doToggleEditMode() {
    const params = this.router.parseUrl(this.router.url).queryParams;
    if (params['editMode']) {
      delete params['editMode'];
    } else {
      params['editMode'] = true;
    }

    this.router.navigate([], {queryParams: params});
  }

  back() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  showBack() {
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];
    const g = outlet?.segments.map(seg => seg.path) || [''];
    return g[1] === 'my' && (g[2] === 'topics' || g[2] === 'groups');
  }

  includedByState(path: string) {
    return this.router.url.includes(this.translate.currentLang + path);
  }
}
