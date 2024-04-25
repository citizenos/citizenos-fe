import { TopicIdeaRepliesService } from 'src/app/services/topic-idea-replies.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take, map } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'idea-reply-form',
  templateUrl: './idea-reply-form.component.html',
  styleUrls: ['./idea-reply-form.component.scss']
})
export class IdeaReplyFormComponent {
  @Input() argument?: Argument;
  @Input() topicId!: string;
  @Input() ideationId!: string;
  @Input() ideaId!: string;
  @Input() showReply!: boolean;
  @Output() showReplyChange = new EventEmitter<boolean>();
  public reply = {
    subject: '',
    type: 'reply',
    text: ''
  };
  ARGUMENT_TYPES = Object.keys(this.TopicIdeaRepliesService.ARGUMENT_TYPES);
  ARGUMENT_TYPES_MAXLENGTH = this.TopicIdeaRepliesService.ARGUMENT_TYPES_MAXLENGTH;
  ARGUMENT_SUBJECT_MAXLENGTH = this.TopicIdeaRepliesService.ARGUMENT_SUBJECT_MAXLENGTH;
  errors = <any>null;
  constructor(public AuthService: AuthService, private TopicIdeaRepliesService: TopicIdeaRepliesService) {
    this.AuthService.loggedIn$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {

        }
      }))
  }

  ngOnInit(): void {
  }

  /* argumentTextLengthCheck(form, form.text) {

   }*/

  saveReply() {
    const reply = {
      parentId: this.argument?.id,
      parentVersion: (this.argument?.edits.length || 1 - 1),
      type: this.reply.type,
      subject: this.reply.subject,
      text: this.reply.text,
      topicId: this.topicId,
      ideationId: this.ideationId,
      ideaId: this.ideaId
    };

    this.errors = null;

    this.TopicIdeaRepliesService
      .save(reply)
      .pipe(take(1))
      .subscribe((reply) => {
        this.TopicIdeaRepliesService.reset();
        /* return this.$state.go(
           this.$state.current.name,
           { commentId: this.getCommentIdWithVersion(comment.id, comment.edits.length - 1) }
         );*/
      });
    /* function (res) {
       this.form.errors = res.data.errors;
     }*/
  };

  close () {
    this.showReplyChange.emit(false);
  }
}