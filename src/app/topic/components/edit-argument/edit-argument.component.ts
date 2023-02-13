import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Argument } from 'src/app/interfaces/argument';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'edit-argument',
  templateUrl: './edit-argument.component.html',
  styleUrls: ['./edit-argument.component.scss']
})
export class EditArgumentComponent implements OnInit {

  @Input() topicId!: string;
  @Input() argument!: Argument;
  @Output() showEdit = new EventEmitter<boolean | null>();
  public ARGUMENT_TYPES = Object.keys(this.TopicArgumentService.ARGUMENT_TYPES);
  public ARGUMENT_TYPES_MAXLENGTH = this.TopicArgumentService.ARGUMENT_TYPES_MAXLENGTH;
  public ARGUMENT_SUBJECT_MAXLENGTH = this.TopicArgumentService.ARGUMENT_SUBJECT_MAXLENGTH;

  edit = {
    subject: '',
    text: '',
    type: '',
    topicId: ''
  }
  errors: any = null;
  constructor(private TopicArgumentService: TopicArgumentService, public app: AppService, public AuthService: AuthService) {
  }

  updateText(text: any) {
    this.edit.text = text;
  }

  argumentMaxLength() {
    return this.ARGUMENT_TYPES_MAXLENGTH[this.edit.type] || this.ARGUMENT_TYPES_MAXLENGTH.pro;
  }
  updateArgument() {
    if (this.edit.type !== this.argument.type || this.argument.subject !== this.edit.subject || this.argument.text !== this.edit.text) {
      this.TopicArgumentService.update(this.edit)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.TopicArgumentService.reset()
          },
          error: (res) => {
            this.errors = res.errors;
          }
        })
      /*
            this.TopicArgumentService
              .update(this.argument)
              .then((commentUpdated) => {
                delete this.argument.errors;
                this.TopicCommentService.reload();
                return this.$state.go(
                  this.$state.current.name,
                  {
                    commentId: this.getCommentIdWithVersion(this.argument.id, this.argument.edits.length)
                  }
                );
              }, (err) => {
                this.$log.error('Failed to update comment', this.argument, err);
                this.argument.errors = err.data.errors;
              });
          } else {
            this.argumentEditMode();*/
    }
  };

  argumentEditMode() {
    this.edit.subject = this.argument.subject;
    this.edit.text = this.argument.text;
    this.edit.type = this.argument.type;
    if (this.argument.showEdits) { // Visible, so we gonna hide, need to clear form errors
      //   delete this.argument.errors;
    }
    this.showEdit.emit(false);
  };

  ngOnInit(): void {
    this.edit = Object.assign(this.edit, this.argument);
    this.edit.topicId = this.topicId;
  }

}
