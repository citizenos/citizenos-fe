import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, map, switchMap } from 'rxjs/operators';
import { UserTopicService } from 'src/app/services/user-topic.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  topics$;

  constructor(public UserTopicService: UserTopicService, public route: ActivatedRoute, private router: Router) {
    this.topics$ = this.route.paramMap.pipe(switchMap((params) => {
        return this.UserTopicService.topics$.pipe(map((items) => {
          if(!params.get('topicId')) {
            this.router.navigateByUrl('/my/topics/' + items[0].id);
          }
          return items;
      }))
    }))
  }

}
