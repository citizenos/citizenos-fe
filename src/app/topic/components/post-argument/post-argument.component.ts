import { trigger, state, style } from '@angular/animations';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs';
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
        'maxHeight': '100%',
        transition: 'max-height 0.2s ease-in-out',
      })),
      state('closed', style({
        padding: '0',
        'maxHeight': '0',
        transition: 'all 0.2s ease-in-out',
      }))
    ])]
})
export class PostArgumentComponent implements OnInit {
  @Input() topicId!: string;
  wWidth = window.innerWidth;
  focusArgumentSubject = false;
  argumentType = <string>'pro';
  errors: any;

  text = <string>'';
  addArgument;
  argumentForm = new UntypedFormGroup({
    subject: new UntypedFormControl('', [Validators.required]),
    text: new UntypedFormControl('', [Validators.required]),
  });

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
    @Inject(Router) private router: Router) {
    this.addArgument = this.app.addArgument.pipe(map((val) => {
      this.text = '';
      this.argumentForm.reset();
      return val;
    }))
  }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  argumentMaxLength() {
    return this.ARGUMENT_TYPES_MAXLENGTH[this.argumentType] || this.ARGUMENT_TYPES_MAXLENGTH.pro;
  }

  updateText(text: any) {
    setTimeout(() => {
      this.argumentForm.controls['text'].markAsTouched();
      this.argumentForm.controls['text'].setValue(text);
    });
  }

  addNewArgument() {
    if (!this.loggedIn()) {
      this.app.doShowLogin();
    } else {
      this.app.addArgument.next(true);
    }
  }

  close() {
    this.app.addArgument.next(false);
  }

  clear() {
    this.updateText('')
    this.text = '';
    this.argumentForm.patchValue({
      subject: '',
      text: ''
    });
    this.argumentForm.markAsUntouched();
    this.argumentForm.controls['subject'].patchValue('');
    this.argumentForm.controls['text'].markAsPristine();
    this.argumentForm.controls['text'].markAsUntouched();
    setTimeout(() => {
      this.argumentForm.controls['text'].markAsPristine();
      this.argumentForm.controls['text'].markAsUntouched();
      this.argumentForm.markAsUntouched()
    })
  }

  postArgument() {
    const argument = {
      parentVersion: 0,
      type: this.argumentType,
      subject: this.argumentForm.value['subject'],
      text: this.argumentForm.value['text'],
      topicId: this.topicId
    };
    this.TopicArgumentService
      .save(argument)
      .pipe(take(1))
      .subscribe({
        next: (argument) => {
          this.TopicArgumentService.reloadArguments();
          this.text = '';
          this.argumentForm.reset();
          this.clear();
          this.app.addArgument.next(false);
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
