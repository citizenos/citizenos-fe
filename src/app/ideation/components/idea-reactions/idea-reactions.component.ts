import { TopicIdeaService } from '@services/topic-idea.service';
import { Component, OnInit, Inject } from '@angular/core';
import { map, of } from 'rxjs';
import { DIALOG_DATA } from 'src/app/shared/dialog';

@Component({
  selector: 'app-idea-reactions',
  templateUrl: './idea-reactions.component.html',
  styleUrls: ['./idea-reactions.component.scss']
})
export class IdeaReactionsComponent {
  private ideationId: string;
  private ideaId: string;
  private topicId: string;
  public voteItems = of(<any[]>[]);
  private itemsPerPage = 10;
  public page = 1;
  public totalPages = 0;
  constructor(private TopicIdeaService: TopicIdeaService, @Inject(DIALOG_DATA) public data: any) {
    this.ideaId = data.ideaId;
    this.ideationId = data.ideationId;
    this.topicId = data.topicId;
  }

  ngOnInit(): void {
    this.voteItems = this.TopicIdeaService
      .votes({
        ideationId: this.ideationId,
        ideaId: this.ideaId,
        topicId: this.topicId
      }).pipe(
        map((commentVotes) => {
          this.totalPages = Math.ceil(commentVotes.rows.length / this.itemsPerPage) || 1;
          this.page = 1;
          return commentVotes.rows
        })
      );
  }
  loadPage(pageNr: number) {
    this.page = pageNr;
  };

  isOnPage(index: any, page: number) {
    const endIndex = page * this.itemsPerPage;

    return (index >= (endIndex - this.itemsPerPage) && index < endIndex);
  }
}
