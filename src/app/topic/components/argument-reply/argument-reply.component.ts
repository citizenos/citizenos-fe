import { NotificationService } from 'src/app/services/notification.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take, map } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
@Component({
  selector: 'argument-reply',
  templateUrl: './argument-reply.component.html',
  styleUrls: ['./argument-reply.component.scss']
})
export class ArgumentReplyComponent implements OnInit {
  @Input() argument!: Argument;
  @Input() topicId!: string;
  @Input() showReply!: boolean;
  @Output() showReplyChange = new EventEmitter<boolean>();
  public reply = {
    subject: '',
    type: 'reply',
    text: ''
  };
  ARGUMENT_TYPES = Object.keys(this.TopicArgumentService.ARGUMENT_TYPES);
  ARGUMENT_TYPES_MAXLENGTH = this.TopicArgumentService.ARGUMENT_TYPES_MAXLENGTH;
  ARGUMENT_SUBJECT_MAXLENGTH = this.TopicArgumentService.ARGUMENT_SUBJECT_MAXLENGTH;
  errors = <any>null;
  constructor(public AuthService: AuthService, private TopicArgumentService: TopicArgumentService, private Notification: NotificationService) {
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
      parentId: this.argument.id,
      parentVersion: (this.argument.edits.length - 1),
      type: this.reply.type,
      subject: this.reply.subject,
      text: this.reply.text,
      topicId: this.topicId
    };

    this.errors = null;
    if (!this.reply.text.length) {
      this.Notification.removeAll();
      this.Notification.addError('COMPONENTS.ARGUMENT_REPLY.ERROR_NO_TEXT');
      return;
    }
    this.TopicArgumentService
      .save(reply)
      .pipe(take(1))
      .subscribe((reply) => {
        this.TopicArgumentService.reset();
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
