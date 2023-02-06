import { Topic } from 'src/app/interfaces/topic';
import { Component, OnInit, Input } from '@angular/core';
import { SocialMentionsService } from 'src/app/services/social-mentions.service';
import { TopicService } from 'src/app/services/topic.service';
import { of } from 'rxjs';

@Component({
  selector: 'topic-social-mentions',
  templateUrl: './topic-social-mentions.component.html',
  styleUrls: ['./topic-social-mentions.component.scss']
})
export class TopicSocialMentionsComponent implements OnInit {
  @Input() topic!:Topic;
  topicSocialMentions$ = of(<any[]>[]);
  constructor(private Mentions: SocialMentionsService, private TopicService: TopicService) {

  }

  canEdit () {
    return this.TopicService.canEdit(this.topic);
  }

  ngOnInit(): void {
    if (this.topic.hashtag) {
      this.Mentions.setParam('topicId', this.topic.id)
      this.topicSocialMentions$ = this.Mentions.loadItems();
    }
  }

}
