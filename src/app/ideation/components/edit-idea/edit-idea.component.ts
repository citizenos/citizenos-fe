import { trigger, state, style } from '@angular/animations';
import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';

@Component({
  selector: 'edit-idea',
  templateUrl: './edit-idea.component.html',
  styleUrls: ['./edit-idea.component.scss'],
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
export class EditIdeaComponent {
  @Input() topicId!: string;
  @Input() ideationId!: string;
  @Input() idea!: Idea;
  @Output() showEdit = new EventEmitter<boolean | null>();
  wWidth = window.innerWidth;
  focusIdeaStatement = false;
  argumentType = <string>'pro';
  errors: any;

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
    public TopicIdeaService: TopicIdeaService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(TranslateService) public translate: TranslateService,
    @Inject(Router) private router: Router) { }

  ngOnInit(): void {
    this.ideaForm.patchValue({
      statement: this.idea.statement,
      description: this.idea.description
    });
    this.description = this.idea.description;
    this.updateText(this.idea.description);
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }

  ideaMaxLength() {
    return 0;
  }

  updateText(text: any) {
    this.ideaForm.controls['description'].markAsTouched();
    this.ideaForm.controls['description'].setValue(text);
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

  postIdea() {
    const idea = {
      ideaId: this.idea.id,
      ideationId: this.idea.ideationId,
      parentVersion: 0,
      statement: this.ideaForm.value['statement'],
      description: this.ideaForm.value['description'],
      topicId: this.topicId
    };
    this.TopicIdeaService
      .update(idea)
      .pipe(take(1))
      .subscribe({
        next: (idea) => {
          this.TopicIdeaService.reset();
          this.TopicIdeaService.setParam('topicId', this.topicId);
          this.TopicIdeaService.setParam('ideationId', this.idea.ideationId);
          this.description = '';
          this.ideaForm.reset();
          this.app.addIdea.next(false);
          this.TopicIdeaService.reloadIdeas();
          this.idea.statement = idea.statement;
          this.idea.description = idea.description;
          this.showEdit.emit(false);

          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { argumentId: this.getIdeaIdWithVersion(idea.id, idea.edits.length - 1) }
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

  ideaEditMode() {
    this.ideaForm.patchValue({ 'statement': this.idea.statement });
    this.ideaForm.patchValue({ 'description': this.idea.description });
    console.log('TERE')
    this.showEdit.emit(false);
  };
}
