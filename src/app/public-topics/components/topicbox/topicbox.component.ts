import { countries } from './../../../services/country.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { TopicEventService } from 'src/app/services/topic-event.service';
import { Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { Component, Input, OnInit } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { Observable, map, of, tap } from 'rxjs';
import { Vote } from 'src/app/interfaces/vote';
import { DialogService } from 'src/app/shared/dialog';
import { TopicReportReasonComponent } from 'src/app/topic/components/topic-report-reason/topic-report-reason.component';

@Component({
  selector: 'topicbox',
  templateUrl: './topicbox.component.html',
  styleUrls: ['./topicbox.component.scss']
})

export class TopicboxComponent implements OnInit {
  @Input() topic = <Topic>{}; // decorate the property with @Input()
  catClass = "varia";
  vote$?: Observable<Vote>;
  milestones$?: Observable<{count: Number}> = of({count: 0});
  ideaCount$?: Observable<{count: Number}> = of({count: 0});
  vote?: Vote;
  constructor(private TopicService: TopicService, private TopicVoteService: TopicVoteService, private router: Router, private TopicEventService: TopicEventService, private DialogService: DialogService, private TopicIdeaService: TopicIdeaService) {
  }

  ngOnInit(): void {
    const catEntries = Object.keys(this.TopicService.CATEGORIES).filter((cat) => this.topic.categories?.indexOf(cat) > -1);
    if (catEntries.length) {
      this.catClass = catEntries[0];
    }
    if (this.topic.voteId || this.topic.vote) {
      this.vote$ = this.TopicVoteService.get({ topicId: this.topic.id, voteId: this.topic.voteId || this.topic.vote?.id }).pipe(
        tap((vote) => this.vote = vote)
      );
    }
    if (this.topic.status === this.TopicService.STATUSES.followUp) {
      this.milestones$ = this.TopicEventService.query({topicId: this.topic.id}).pipe(map((res) => {return {count: res.count}}));
    }
    if (this.topic.status === this.TopicService.STATUSES.ideation && this.topic.ideationId) {
      this.ideaCount$ = this.TopicIdeaService.query({topicId: this.topic.id, ideationId: this.topic.ideationId}).pipe(
        map((res) => {
          console.log(res.data);
          if( typeof res.data.count  === 'number') return {count: res.data.count};
          return {count: 0};
        })
      )
    }
  }

  showInfo() {
    return window.innerWidth > 667;
  }

  getTopicPath () {
    let urlArray = ['topics', this.topic.id];
    if (this.topic.status === this.TopicService.STATUSES.draft && this.TopicService.canDelete(this.topic)) {
      urlArray = ['topics', 'edit', this.topic.id];
      if (this.topic.voteId) {
        urlArray = ['topics', 'vote', 'edit', this.topic.id];
      }
      if (this.topic.ideationId) {
        urlArray = ['topics', 'ideation', 'edit', this.topic.id];
      }
    }
    let fragment = 'discussion';
    if (this.topic.status === this.TopicService.STATUSES.draft) {
      fragment = 'info';
    }
    if (this.topic.status === this.TopicService.STATUSES.ideation) {
      fragment = 'ideation';
    }
    if (this.topic.status === this.TopicService.STATUSES.voting) {
      fragment = 'voting';
    } else if (this.topic.status === this.TopicService.STATUSES.followUp) {
      fragment = 'followUp';
    }
    return {urlArray, fragment};
  }

  getTopicLink() {
    const navItems = this.getTopicPath();
    return this.router.createUrlTree(navItems.urlArray, {fragment: navItems.fragment});
  }

  goToView() {
    const navItems = this.getTopicPath();
    this.router.navigate(navItems.urlArray, { fragment: navItems.fragment });
  }

  getProgress() {
    switch (this.topic.status) {
      case 'inProgress':
        return 100;
      case 'voting':
        return Math.floor(((this.vote?.votersCount || 0) / this.topic.members.users.count) * 100);
      default:
        return 100;
    }
  }


  getDescription() {
    const element = document.createElement('html');
    element.innerHTML = this.topic.description;
    if (this.topic.title) {
      return element.innerHTML.replace(this.topic.title, '')
    }

    return element.innerHTML;
  }

  reportReasonDialog() {
    this.DialogService.open(TopicReportReasonComponent, {
      data: {
        report: {
          moderatedReasonText: this.topic.report?.moderatedReasonText || this.topic.report?.text,
          moderatedReasonType: this.topic.report?.moderatedReasonType || this.topic.report?.type,
        }
      }
    })
  }
}
