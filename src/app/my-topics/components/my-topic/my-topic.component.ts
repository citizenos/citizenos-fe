import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'my-topic',
  templateUrl: './my-topic.component.html',
  styleUrls: ['./my-topic.component.scss']
})
export class MyTopicComponent implements OnInit {
  topic$: Observable<Topic>;


  generalInfo = true;
  activities = false;

  constructor(public TopicService: TopicService, private route: ActivatedRoute, private router: Router) {
    this.topic$ = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      })
    );
  }

  ngOnInit(): void {
  }

}
