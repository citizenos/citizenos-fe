import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Topic } from 'src/app/interfaces/topic';
import { TopicService } from 'src/app/services/topic.service';
import { TopicJoinService } from 'src/app/services/topic-join.service';
import { LocationService } from 'src/app/services/location.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'topic-share',
  templateUrl: './topic-share.component.html',
  styleUrls: ['./topic-share.component.scss']
})
export class TopicShareComponent implements OnInit {
  @Input() topic!: Topic;
  @ViewChild('linkInput') linkInput!: ElementRef;
  join = {
    level: <string | null>this.TopicService.LEVELS.read,
    token: <string | null>null
  };
  joinUrl = ''
  LEVELS = Object.keys(this.TopicService.LEVELS);
  showQR = false;
  copySuccess = false;
  constructor(
    private Auth: AuthService,
    private dialog: MatDialog,
    private TopicService: TopicService,
    private TopicJoinService: TopicJoinService,
    private Location: LocationService) {
  }

  ngOnInit(): void {
   if (this.topic.join) {
      this.join = this.topic.join;
    }
  //this.join.token = this.topic.join.token;
    this.generateJoinUrl();
  }

  canUpdate() {
    return this.TopicService.canUpdate(this.topic);
  }

  generateTokenJoin() {
    const generateTokenDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'MODALS.TOPIC_INVITE_SHARE_LINK_GENERATE_CONFIRM_TXT_ARE_YOU_SURE',
        heading: 'MODALS.TOPIC_INVITE_SHARE_LINK_GENERATE_CONFIRM_HEADING',
        closeBtn: 'MODALS.TOPIC_INVITE_SHARE_LINK_GENERATE_CONFIRM_BTN_NO',
        confirmBtn: 'MODALS.TOPIC_INVITE_SHARE_LINK_GENERATE_CONFIRM_BTN_YES',
        points: ['MODALS.TOPIC_INVITE_SHARE_LINK_GENERATE_CONFIRM_TXT_POINT1', 'MODALS.TOPIC_INVITE_SHARE_LINK_GENERATE_CONFIRM_TXT_POINT2']
      }
    });
    generateTokenDialog.afterClosed().pipe(take(1)).subscribe(result => {
      if (result === true) {
        this.TopicJoinService
          .save({
            topicId: this.topic.id,
            userId: this.Auth.user.value.id,
            level: this.join.level
          }).pipe(take(1)).subscribe(res => {
            this.topic.join = res;
            this.join.token = res.token;
            this.join.level = res.level;
            this.generateJoinUrl();
          })
      }
    });
  };

  doUpdateJoinToken(level: string) {
    const topicJoin = {
      topicId: this.topic.id,
      userId: this.Auth.user.value.id,
      level: level,
      token: this.join.token
    };

    this.TopicJoinService.update(topicJoin).pipe(take(1)).subscribe(() => {
      this.join.level = level;
    })
  };

  copyInviteLink() {
    const urlInputElement = this.linkInput.nativeElement as HTMLInputElement || null;
    urlInputElement.focus();
    urlInputElement.select();
    urlInputElement.setSelectionRange(0, 99999);
    document.execCommand('copy');
    this.copySuccess = true;
    setTimeout(() => {
      this.copySuccess = false;
    },500)
  };

  generateJoinUrl() {
    if (this.join.token && this.TopicService.canShare(this.topic)) {
      this.joinUrl = this.Location.getAbsoluteUrl('/topics/join/' + this.join.token);
    }
  };
}
