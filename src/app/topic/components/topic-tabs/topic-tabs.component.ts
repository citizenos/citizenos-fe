import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Topic } from '@interfaces/topic';
import { AuthService } from '@services/auth.service';
import { TopicService } from '@services/topic.service';

@Component({
  selector: 'topic-tabs',
  templateUrl: './topic-tabs.component.html',
  styleUrls: ['./topic-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class TopicTabsComponent {
  @Input() topic!: Topic;
  @Input() tabSelected!: string;

  constructor(public TopicService: TopicService,  public auth: AuthService) {
  }

  toggleFavourite(topic: Topic) {
    this.TopicService.toggleFavourite(topic);
  }
}
