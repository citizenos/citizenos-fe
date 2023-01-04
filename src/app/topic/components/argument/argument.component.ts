import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Argument } from 'src/app/interfaces/argument';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';

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
  showDeleteReason = false;
  errors = [];

  constructor(public config: ConfigService, public Auth: AuthService, private Location: LocationService) { }

  ngOnInit(): void {
  }

  isEdited () {
    return this.argument.edits.length > 1;
  };

  canEdit () {
    return (this.argument.creator.id === this.Auth.user.value.id && !this.argument.deletedAt);
  };

  isVisible () {
    return (!this.argument.deletedAt && !this.showDeletedArgument) || (this.argument.deletedAt && this.showDeletedArgument);
  };

  argumentEditMode () {
  /*  this.editSubject = this.argument.subject;
    this.editText = this.argument.text;
    this.editType = this.argument.type;*/
    if (this.showEdit) { // Visible, so we gonna hide, need to clear form errors
      this.errors = [];
    }
    this.showEdit = !this.showEdit;
  };

  doShowDeleteArgument() {
    console.log('show delete argument')
   // this.$log.debug('Argument.doShowDeleteComment()', comment);

    /*this.ngDialog
        .openConfirm({
            template: '/views/modals/topic_delete_comment.html',
            data: {
                comment: comment
            }
        })
        .then(() => {
            comment.topicId = this.topicId;
            this.TopicComment
                .delete(comment)
                .then(() => {
                    return this.$state.go(
                        this.$state.current.name,
                        {
                            commentId: this.getCommentIdWithVersion(comment.id, comment.edits.length - 1)
                        },
                        {
                            reload: true
                        }
                    );
                }, angular.noop);
        });*/
  };

  copyArgumentLink (event:MouseEvent) {
    const id = this.argument.id+ + '_v' + (this.argument.edits.length-1);
    const urlInputElement = document.getElementById('comment_link_input_' + id) as HTMLInputElement || null;
    const url = this.Location.getAbsoluteUrl('/topics/:topicId', {topicId: this.topicId}, {commentId: id});
    urlInputElement.value = url;
    urlInputElement.focus();
    urlInputElement.select();
    urlInputElement.setSelectionRange(0, 99999);
    document.execCommand('copy');

    var X = event.pageX;
    var Y = event.pageY;

    //this.sNotification.inline(this.$translate.instant('VIEWS.TOPICS_TOPICID.ARGUMENT_LNK_COPIED'), X, Y - 35);
  };

  doArgumentReport () {
    /*this.ngDialog
        .open({
            template: '<topic-comment-report comment-id="'+comment.id+'"></topic-comment-report>',
            plain: true
        });*/
  };

  doCommentVote (value: number) {
    if (!this.Auth.loggedIn$.getValue) {
        return;
    }

    const topicComment = {
        commentId: this.argument.id,
        topicId: this.topicId,
        value: value
    };

  /*  this.TopicComment
        .vote(topicComment)
        .then((voteResult) => {
            comment.votes = voteResult;
        });*/
  };

  doShowVotersList () {
    /*this.ngDialog
        .open({
            template: `<topic-comment-reactions topic-id="${this.topicId}" comment-id="${comment.id}"></topic-comment-reactions>`,
            plain:true
        });*/
};
}
