import { trigger, state, style } from '@angular/animations';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
@Component({
  selector: 'post-argument',
  templateUrl: './post-argument.component.html',
  styleUrls: ['./post-argument.component.scss'],
  animations: [
    trigger('openSlide', [
      // ...
      state('open', style({
        padding: '12px 16px',
        'maxHeight': 'initial',
        transition: '0.2s ease-in-out max-height'
      })),
      state('closed', style({
        padding: '0',
        'maxHeight': '0',
        transition: '0.2s ease-in-out max-height'
      }))
  ])]
})
export class PostArgumentComponent implements OnInit {
  @Input() topicId!: string;
  addArgument = false;
  wWidth = window.innerWidth;
  focusArgumentSubject = false;
  subject = <string>'';
  argumentType = <string>'pro';
  text = <string>'';
  errors: any;
  ARGUMENT_TYPES = Object.keys(this.TopicArgumentService.ARGUMENT_TYPES).filter((key) => key != 'reply');
  ARGUMENT_TYPES_MAXLENGTH = this.TopicArgumentService.ARGUMENT_TYPES_MAXLENGTH;
  ARGUMENT_SUBJECT_MAXLENGTH = this.TopicArgumentService.ARGUMENT_SUBJECT_MAXLENGTH;
  private COMMENT_VERSION_SEPARATOR = '_v';
  constructor(
    public app: AppService,
    private AuthService: AuthService,
    public TopicArgumentService: TopicArgumentService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(TranslateService) public translate: TranslateService,
    @Inject(Router) private router: Router) { }

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
    this.TopicArgumentService
      .save(argument)
      .pipe(take(1))
      .subscribe({
        next: (argument) => {
          this.subject = '';
          this.text = '';
          this.TopicArgumentService.reset();
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { argumentId: this.getCommentIdWithVersion(argument.id, argument.edits.length - 1) }
            });
        },
        error: (err) => {
          console.error(err);
          this.errors = err;
        }
      })
  };

  getCommentIdWithVersion(commentId: string, version: number) {
    return commentId + this.COMMENT_VERSION_SEPARATOR + version;
  };
}
