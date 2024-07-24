import { TopicIdeationService } from 'src/app/services/topic-ideation.service';

import { trigger, state, style } from '@angular/animations';
import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take, map } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'add-idea',
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.scss'],
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
export class AddIdeaComponent {

  @Input() topicId!: string;
  @Input() ideationId!: string;
  @Input() notification: any;
  @Output() notificationChange = new EventEmitter<any>();

  wWidth = window.innerWidth;
  focusIdeaStatement = false;
  argumentType = <string>'pro';
  errors: any;
  addIdea;
  description = <string>'';
  ideaForm = new UntypedFormGroup({
    statement: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
  });

  IDEA_STATEMENT_MAXLENGTH = 1024;
  private IDEA_VERSION_SEPARATOR = '_v';
  constructor(
    public app: AppService,
    private AuthService: AuthService,
    private TopicIdeationService: TopicIdeationService,
    private Notification: NotificationService,
    public TopicIdeaService: TopicIdeaService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(TranslateService) public translate: TranslateService,
    @Inject(Router) private router: Router) {
    this.addIdea = this.app.addIdea.pipe(map((val) => {
      this.description = '';
      this.ideaForm.reset();
      return val;
    }))
  }

  ngOnInit(): void {

  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  ideaMaxLength() {
    return 0;
  }

  updateText(text: any) {
    setTimeout(() => {
      this.ideaForm.controls['description'].markAsTouched();
      this.ideaForm.controls['description'].setValue(text);
    })
  }

  addNewIdea() {
    if (!this.loggedIn()) {
      this.app.doShowLogin();
    } else {
      this.app.addIdea.next(true);
    }
  }

  close() {
    this.app.addIdea.next(false);
  }

  clear() {
    this.updateText('')
    this.description = '';
    this.ideaForm.patchValue({
      statement: '',
      description: ''
    });
    this.ideaForm.markAsUntouched();
    this.ideaForm.controls['statement'].patchValue('');
    this.ideaForm.controls['description'].markAsPristine();
    this.ideaForm.controls['description'].markAsUntouched();
    setTimeout(() => {
      this.ideaForm.controls['description'].markAsPristine();
      this.ideaForm.controls['description'].markAsUntouched();
      this.ideaForm.markAsUntouched()
    })
  }
  postIdea() {
    const idea = {
      parentVersion: 0,
      statement: this.ideaForm.value['statement'],
      description: this.ideaForm.value['description'],
      topicId: this.topicId,
      ideationId: this.ideationId
    };
    this.TopicIdeaService
      .save(idea)
      .pipe(take(1))
      .subscribe({
        next: (idea) => {
          this.TopicIdeaService.reloadIdeas();
          this.TopicIdeationService.reloadIdeation();
          this.description = '';
          this.ideaForm.reset();
          this.clear();
          this.app.addIdea.next(false);
          /*  this.notificationChange.emit({
              level: 'success',
              message: this.translate.instant('COMPONENTS.ADD_IDEA.MSG_SUCCESS')
            })*/
          setTimeout(() =>
            this.Notification.addSuccess('COMPONENTS.ADD_IDEA.MSG_SUCCESS'), 1000);
          this.router.navigate(
            ['ideation', this.ideationId, 'ideas', idea.id],
            {
              relativeTo: this.route
            });
        },
        error: (err) => {
          console.error(err);
          this.errors = err;
        }
      })
  };

  getIdeaIdWithVersion(ideaId: string, version: number) {
    return ideaId + this.IDEA_VERSION_SEPARATOR + version;
  };
}
