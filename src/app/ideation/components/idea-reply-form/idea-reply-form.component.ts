import { NotificationService } from './../../../services/notification.service';
import { TopicIdeaRepliesService } from 'src/app/services/topic-idea-replies.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take, map } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { relative } from 'path';
import { ActivatedRoute, Router } from '@angular/router';

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
  @Input() editMode = false;
  @Output() showReplyChange = new EventEmitter<boolean>();

  @Input() showReplies?:boolean = false;
  @Output() showRepliesChange = new EventEmitter<boolean>();
  public reply = {
    type: 'reply',
    text: ''
  };
  ARGUMENT_TYPES = Object.keys(this.TopicIdeaRepliesService.ARGUMENT_TYPES);
  ARGUMENT_TYPES_MAXLENGTH = this.TopicIdeaRepliesService.ARGUMENT_TYPES_MAXLENGTH;
  ARGUMENT_SUBJECT_MAXLENGTH = this.TopicIdeaRepliesService.ARGUMENT_SUBJECT_MAXLENGTH;
  errors = <any>null;
  constructor(public AuthService: AuthService, private TopicIdeaRepliesService: TopicIdeaRepliesService, private translate: TranslateService, private Notification: NotificationService,
    private router: Router, private activatedRoute: ActivatedRoute
  ) {
    this.AuthService.loggedIn$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {

        }
      }))
  }

  ngOnInit(): void {
    if (this.editMode && this.argument) {
      this.reply = this.argument;
    }
  }

  /* argumentTextLengthCheck(form, form.text) {

   }*/

  saveReply() {
    const reply = {
      parentId: this.argument?.id,
      parentVersion: (this.argument?.edits.length || 1 - 1),
      type: this.reply.type,
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
        this.TopicIdeaRepliesService.reloadArguments();
        this.Notification.addSuccess('COMPONENTS.IDEA_REPLY_FORM.MSG_SUCCESS');
        this.showRepliesChange.emit(true);
        this.close();
      });
    /* function (res) {
       this.form.errors = res.data.errors;
     }*/
  };

  saveEdit() {
    const reply = {
      id: this.argument?.id,
      parentId: this.argument?.id,
      parentVersion: (this.argument?.edits.length || 1 - 1),
      type: this.reply.type,
      text: this.reply.text,
      topicId: this.topicId,
      ideationId: this.ideationId,
      ideaId: this.ideaId
    };

    this.errors = null;

    this.TopicIdeaRepliesService
      .update(reply)
      .pipe(take(1))
      .subscribe((reply) => {
        this.TopicIdeaRepliesService.reloadArguments();
        this.showRepliesChange.emit(true);
        this.close();
        this.router.navigate(
          [],
          {
            relativeTo: this.activatedRoute,
            queryParams: {replyId: reply.id},
            queryParamsHandling: 'merge',
          }
        );
        /* return this.$state.go(
           this.$state.current.name,
           { commentId: this.getCommentIdWithVersion(comment.id, comment.edits.length - 1) }
         );*/
      });
  }
  close () {
    this.showReplyChange.emit(false);
  }
}
