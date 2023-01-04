import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TopicService } from 'src/app/services/topic.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  topic$ ; // decorate the property with @Input()
  editMode = false;
  showInfoEdit = false;
  hideTopicContent = false;
  topicSocialMentions = [];
  activeCommentSection = 'arguments';
  wWidth: number = window.innerWidth;

  constructor(public TopicService: TopicService, private route: ActivatedRoute, public TopicArgumentService: TopicArgumentService) {
    this.topic$= this.route.params.pipe<Topic>(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      })
    );
  }

  ngOnInit(): void {

    console.log('Topic', this.topic$)
  }

  hideInfoEdit () {
    this.showInfoEdit = false;
  };

}
