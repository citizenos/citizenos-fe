import { Component, OnInit, Inject } from '@angular/core';
import { map, of } from 'rxjs';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ArgumentReactionsData {
  commentId: string,
  topicId: string
};

@Component({
  selector: 'app-argument-reactions',
  templateUrl: './argument-reactions.component.html',
  styleUrls: ['./argument-reactions.component.scss']
})

export class ArgumentReactionsComponent implements OnInit {
  private commentId:string;
  private topicId:string;
  public voteItems = of(<any[]>[]);
  private itemsPerPage = 10;
  public page = 1;
  public totalPages = 0;
  constructor(private TopicArgumentService: TopicArgumentService, @Inject(MAT_DIALOG_DATA) public data: ArgumentReactionsData,) {
    this.commentId = data.commentId;
    this.topicId = data.topicId;
  }

  ngOnInit(): void {
    this.voteItems = this.TopicArgumentService
    .votes({
        commentId: this.commentId,
        topicId: this.topicId
    }).pipe(
      map((commentVotes) => {
        this.totalPages = Math.ceil(commentVotes.rows.length / this.itemsPerPage) || 1;
        this.page = 1;
        return commentVotes.rows
      })
    );
  }
  loadPage(pageNr:number) {
    this.page = pageNr;
  };

  isOnPage(index:any, page:number) {
    const endIndex = page * this.itemsPerPage;

    return (index >= (endIndex - this.itemsPerPage) && index < endIndex);
  }
}
