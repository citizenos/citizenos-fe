import { Component, OnInit, Input } from '@angular/core';
import { take } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
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

  public reply = {
    subject: '',
    type: 'reply',
    text: ''
  };
  ARGUMENT_TYPES = Object.keys(this.TopicArgumentService.ARGUMENT_TYPES);
  ARGUMENT_TYPES_MAXLENGTH = this.TopicArgumentService.ARGUMENT_TYPES_MAXLENGTH;
  ARGUMENT_SUBJECT_MAXLENGTH = this.TopicArgumentService.ARGUMENT_SUBJECT_MAXLENGTH;
  errors = <any>null;
  constructor(public AuthService: AuthService, private TopicArgumentService: TopicArgumentService) { }

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

    this.TopicArgumentService
      .save(reply)
      .pipe(take(1))
      .subscribe((reply) => {
        console.log(reply)
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

}
