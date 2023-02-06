import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
@Component({
  selector: 'post-argument',
  templateUrl: './post-argument.component.html',
  styleUrls: ['./post-argument.component.scss']
})
export class PostArgumentComponent implements OnInit {
  @Input() topicId!:string;
  wWidth = window.innerWidth;
  focusArgumentSubject = false;
  subject = <string>'';
  argumentType = <string>'pro';
  text = <string>'';
  errors: any;
  ARGUMENT_TYPES = Object.keys(this.TopicArgumentService.ARGUMENT_TYPES);
  ARGUMENT_TYPES_MAXLENGTH = this.TopicArgumentService.ARGUMENT_TYPES_MAXLENGTH;
  ARGUMENT_SUBJECT_MAXLENGTH = this.TopicArgumentService.ARGUMENT_SUBJECT_MAXLENGTH;
  private COMMENT_VERSION_SEPARATOR = '_v';
  constructor(public app: AppService, private AuthService: AuthService, public TopicArgumentService: TopicArgumentService, private router: Router) { }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  argumentMaxLength() {
    return this.ARGUMENT_TYPES_MAXLENGTH[this.argumentType] || this.ARGUMENT_TYPES_MAXLENGTH.pro;
  }

  updateText(text: any) {
    this.text = text;
  }

  postArgument() {
    const argument = {
      parentVersion: 0,
      type: this.argumentType,
      subject: this.subject,
      text: this.text,
      topicId: this.topicId
    };
    /*
        this.errors = null;
    */
    this.TopicArgumentService
      .save(argument)
      .pipe(take(1))
      .subscribe((argument) => {
        console.log(argument, { commentId: this.getCommentIdWithVersion(argument.id, argument.edits.length - 1) })
        this.TopicArgumentService.reset();
        // this.router.navigate()
        /*return this.$state.go(
          this.$state.current.name,
          { commentId: this.getCommentIdWithVersion(comment.id, comment.edits.length - 1) }
        );*/
      })
  };

  getCommentIdWithVersion(commentId:string, version:number) {
    return commentId + this.COMMENT_VERSION_SEPARATOR + version;
  };
}
