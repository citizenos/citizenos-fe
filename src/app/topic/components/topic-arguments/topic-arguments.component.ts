import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, of, catchError, EMPTY } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';

@Component({
  selector: 'topic-arguments',
  templateUrl: './topic-arguments.component.html',
  styleUrls: ['./topic-arguments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopicArgumentsComponent implements OnInit {

  arguments$ = of(<Argument[]>[]);
  topicId = '';
  constructor(private route: ActivatedRoute, public TopicArgumentService: TopicArgumentService) {

    this.arguments$ = this.route.params.pipe(
      switchMap(
        (routeParams) => {
          this.topicId = routeParams['topicId'];
          this.TopicArgumentService.updateParams({topicId: routeParams['topicId']});
          return this.TopicArgumentService.params$.pipe(
            switchMap(
              (params) => {
                return this.TopicArgumentService.getArguments(params)
              }
            )
          )
        }
      ),
      catchError(() => EMPTY)
    )

  }

  ngOnInit(): void {
  }

}
