import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'app-topic-follow-up-create-dialog',
  templateUrl: './topic-follow-up-create-dialog.component.html',
  styleUrls: ['./topic-follow-up-create-dialog.component.scss']
})
export class TopicFollowUpCreateDialogComponent {
  topic!: Topic;
  tabs = [...Array(2).keys()];
  tabActive = 1;
  title: string = '';

  private dialog = inject(MatDialog);
  private data = inject(MAT_DIALOG_DATA);

  constructor (public TopicService: TopicService,
    public TopicVoteService: TopicVoteService,
    public Translate: TranslateService,
    public Notification: NotificationService,
    @Inject(ActivatedRoute) public route: ActivatedRoute,
    public router: Router
    ) {

  }

  ngOnInit(): void {
    this.topic = this.data.topic;
  }

  startFollowUp () {
    return this.TopicService.changeState(this.topic, 'followUp', this.route.toString());
  }
  tabNext () {
    (this.tabActive < this.tabs.length)? this.tabActive = this.tabActive+1 : this.startFollowUp();
  }
}
