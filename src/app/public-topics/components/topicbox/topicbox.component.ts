import { Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { TopicVoteService } from 'src/app/services/topic-vote.service';
import { Component, Input, OnInit } from '@angular/core';
import { Topic } from 'src/app/interfaces/topic';
import { Observable, tap } from 'rxjs';
import { Vote } from 'src/app/interfaces/vote';

@Component({
  selector: 'topicbox',
  templateUrl: './topicbox.component.html',
  styleUrls: ['./topicbox.component.scss']
})

export class TopicboxComponent implements OnInit {
  @Input() topic = <Topic>{}; // decorate the property with @Input()
  catClass = "varia";
  vote$?: Observable<Vote>;
  vote?: Vote;
  constructor(private TopicService: TopicService, private TopicVoteService: TopicVoteService, private router: Router) {
  }

  ngOnInit(): void {
    const catEntries = Object.keys(this.TopicService.CATEGORIES).filter((cat) => this.topic.categories?.indexOf(cat) > -1);
    if (catEntries.length) {
      this.catClass = catEntries[0];
    }
    if (this.topic.voteId) {
      this.vote$ = this.TopicVoteService.get({topicId: this.topic.id, voteId: this.topic.voteId}).pipe(
        tap((vote) => this.vote = vote)
      );
    }
  }

  showInfo () {
    return window.innerWidth > 667;
  }

  goToView() {
    this.router.navigate(['topics', this.topic.id]);
  }

  getProgress () {
    switch (this.topic.status) {
      case 'inProgress':
          return 100;
      case 'voting':
          return Math.floor(((this.vote?.votersCount || 0) / this.topic.members.users.count) * 100) ;
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
}
