import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss']
})

export class TopicListItemComponent {
  @Input() topic!: Topic;
  constructor(private router: Router, private route: ActivatedRoute, public TopicService: TopicService) {
  }
  isActiveItem () {
    return this.topic.id === this.route.snapshot.params['topicId'];
  }
  goToItemView() {
    this.router.navigate(['my','topics', this.topic.id]);
  }
  goToView (check: boolean) {
    this.router.navigate(['topics', this.topic.id], {queryParams: {editMode:true}});
  }
}
