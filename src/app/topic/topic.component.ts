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
  topic$; // decorate the property with @Input()
  editMode = false;
  showInfoEdit = false;
  hideTopicContent = false;
  topicSocialMentions = [];
  activeCommentSection = 'arguments';
  wWidth: number = window.innerWidth;
  topicSettings = false;
  more_info_button = false; //app.more_info_button not sure where used
  constructor(public TopicService: TopicService, private route: ActivatedRoute, public TopicArgumentService: TopicArgumentService) {
    this.topic$ = this.route.params.pipe<Topic>(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      })
    );
  }

  ngOnInit(): void {

    console.log('Topic', this.topic$)
  }

  hideInfoEdit() {
    this.showInfoEdit = false;
  };

  togglePin(topic: Topic) {
    this.TopicService.togglePin(topic);
  }

  doShowReportOverlay() {
    /*this.ngDialog.openConfirm({
      template: '/views/modals/topic_reports_reportId.html',
      data: this.$stateParams,
      scope: this,
      closeByEscape: false
    }).then(() => {
      this.hideTopicContent = false;
    }, () => {
      this.$state.go('home');
    }
    );*/
  };

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
