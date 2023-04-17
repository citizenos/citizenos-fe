import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss']
})

export class TopicListItemComponent {
  @Input() topic!: Topic;
  constructor(private router: Router, private route: ActivatedRoute, public TopicService: TopicService, public translate: TranslateService) {
  }
  isActiveItem () {
    return this.router.url.indexOf(this.topic.id) > -1;
  }

  goToEditView () {
    this.router.navigate(['topics', this.topic.id], {queryParams: {editMode:true}});
  }
}
