import { NotificationService } from '@services/notification.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { take, map } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
import { AppService } from '@services/app.service';
import { AuthService } from '@services/auth.service';
import { TopicArgumentService } from '@services/topic-argument.service';
import { Router } from '@angular/router';
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
  constructor(public AuthService: AuthService, private TopicArgumentService: TopicArgumentService, private Notification: NotificationService, private router: Router) {
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
      discussionId: this.argument.discussionId,
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
       /* console.log(reply);
        console.log(this.argument);
        this.argument.showReplies = true;
        this.showReply = false;
        if(!this.argument.replies.rows) this.argument.replies.rows = [];
        this.argument.replies.rows.push(reply);*/
        this.TopicArgumentService.reset();
        this.router.navigate(['/', 'topics', this.topicId], {queryParams: {argumentId: reply.id+"_v0"}});
        /*console.log(this.argument)
        this.TopicArgumentService.items$.pipe(take(1)).subscribe((rows) => {
          console.log('ARGUMENTS', rows);
          rows.forEach((arg) => {
            if (arg.id === this.argument.id) arg.showReplies = true;
            if (!arg.showReplies) {
              arg.replies.rows.forEach((reply: Argument) => {
                arg.showReplies = true;
                if (reply.id === this.argument.id) reply.showReplies = true;
              });
            }
          })
        })*/
      });
    /* function (res) {
       this.form.errors = res.data.errors;
     }*/
  };

  close () {
    this.showReplyChange.emit(false);
  }
}
