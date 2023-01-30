import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Argument } from 'src/app/interfaces/argument';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ArgumentReactionsComponent } from '../argument-reactions/argument-reactions.component';
@Component({
  selector: 'argument',
  templateUrl: './argument.component.html',
  styleUrls: ['./argument.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArgumentComponent implements OnInit {
  @Input() argument!: Argument;
  @Input() topicId!: string;
  showEdit = false;
  showEdits = false;
  showReply = false;
  showReplies = false;
  showDeletedArgument = false;
  errors = [];

  constructor(
    public dialog: MatDialog,
    public config: ConfigService,
    public Auth: AuthService,
    private Location: LocationService,
    private Notification: NotificationService,
    private Translate: TranslateService,
    public TopicArgumentService: TopicArgumentService
  ) { }

  ngOnInit(): void {
  }

  isEdited() {
    return this.argument.edits.length > 1;
  };

  canEdit() {
    return (this.argument.creator.id === this.Auth.user.value.id && !this.argument.deletedAt);
  };

  isVisible() {
    return (!this.argument.deletedAt && !this.showDeletedArgument) || (this.argument.deletedAt && this.showDeletedArgument);
  };

  argumentEditMode() {
    /* this.editSubject = this.argument.subject;
     this.editText = this.argument.text;
     this.editType = this.argument.type;*/
    if (this.showEdit) { // Visible, so we gonna hide, need to clear form errors
      this.errors = [];
    }
    this.showEdit = !this.showEdit;
  };

  toggleEdit(event: any) {
    this.argumentEditMode();
  }
  doShowDeleteArgument() {
    console.log('show delete argument')
    const deleteArgument = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_DELETE_ARGUMENT_TITLE',
        title: 'MODALS.TOPIC_DELETE_ARGUMENT_TITLE',
        points: ['MODALS.TOPIC_DELETE_ARGUMENT_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.TOPIC_DELETE_ARGUMENT_BTN_YES',
        closeBtn: 'MODALS.TOPIC_DELETE_ARGUMENT_BTN_NO'
      }
    });

    deleteArgument.afterClosed().subscribe((confirm) => {
      if (confirm === true) {
        const argument = Object.assign({ topicId: this.topicId }, this.argument);
        this.TopicArgumentService
          .delete(argument)
          .pipe(take(1))
          .subscribe(() => {
            /* return this.$state.go(
                 this.$state.current.name,
                 {
                     commentId: this.getCommentIdWithVersion(comment.id, comment.edits.length - 1)
                 },
                 {
                     reload: true
                 }
             );*/
          });
      }
    });
  };

  copyArgumentLink(event: MouseEvent) {
    const id = this.argument.id + '_v' + (this.argument.edits.length - 1);
    const url = this.Location.getAbsoluteUrl('/topics/:topicId', { topicId: this.topicId }, { commentId: id });
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    var X = event.pageX;
    var Y = event.pageY;

    this.Notification.inline(this.Translate.instant('VIEWS.TOPICS_TOPICID.ARGUMENT_LNK_COPIED'), X, Y - 35);
  };

  doArgumentReport() {
    /*this.ngDialog
        .open({
            template: '<topic-comment-report comment-id="'+comment.id+'"></topic-comment-report>',
            plain: true
        });*/
  };

  doArgumentVote(value: number) {
    if (!this.Auth.loggedIn$.getValue) {
      return;
    }

    const argument = {
      commentId: this.argument.id,
      topicId: this.topicId,
      value: value
    };

    this.TopicArgumentService
      .vote(argument)
      .pipe(take(1))
      .subscribe((voteResult) => {
        console.log(voteResult)
        this.argument.votes = voteResult;
      });
  };

  doShowVotersList() {
    this.dialog.open(ArgumentReactionsComponent, {
      data: {
        commentId: this.argument.id,
        topicId: this.topicId
      }
    });
  };
}
