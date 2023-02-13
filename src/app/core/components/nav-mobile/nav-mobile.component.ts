import { Component, OnInit } from '@angular/core';
import { PRIMARY_OUTLET, Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'nav-mobile',
  templateUrl: './nav-mobile.component.html',
  styleUrls: ['./nav-mobile.component.scss']
})
export class NavMobileComponent implements OnInit {

  constructor(public app: AppService, private TopicService: TopicService, private router: Router, private route: ActivatedRoute) {

  }

  canEdit(topic: Topic) {
    return this.TopicService.canEdit(topic);
  }

  ngOnInit(): void {
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
  }

  showBack() {
    const parsedUrl = this.router.parseUrl(this.router.url);
    const outlet = parsedUrl.root.children[PRIMARY_OUTLET];
    const g = outlet?.segments.map(seg => seg.path) || [''];
    return g[1] === 'my' && (g[2] === 'topics' || g[2] === 'groups');
  }
}
