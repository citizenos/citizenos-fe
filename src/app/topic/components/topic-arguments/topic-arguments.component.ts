import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, of, catchError, EMPTY } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { Argument } from 'src/app/interfaces/argument';
import { AuthService } from 'src/app/services/auth.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';

@Component({
  selector: 'topic-arguments',
  templateUrl: './topic-arguments.component.html',
  styleUrls: ['./topic-arguments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopicArgumentsComponent implements OnInit {
  @Input() topic!: Topic;
  @ViewChild('post_argument_wrap') postArgumentEl?: ElementRef;

  arguments$ = of(<Argument[] | any[]>[]);
  orderByOptions = Object.keys(this.TopicArgumentService.ARGUMENT_ORDER_BY);
  focusArgumentSubject = false;
  constructor(
    private Auth: AuthService,
    private route: ActivatedRoute, public TopicArgumentService: TopicArgumentService) {
    this.arguments$ = this.TopicArgumentService.loadItems();
  }

  ngOnInit(): void {
    this.TopicArgumentService.setParam('topicId', this.topic.id)
  }

  doAddComment() {
    if (this.Auth.loggedIn$.value) {
      this.postArgumentEl?.nativeElement.scrollIntoView();
      this.focusArgumentSubject = true;
    } else {
      // this.app.doShowLogin();
    }
  };

}
