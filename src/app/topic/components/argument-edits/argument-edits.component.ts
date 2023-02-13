import { Component, OnInit, Input } from '@angular/core';
import { TopicArgumentService } from 'src/app/services/topic-argument.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LocationService } from 'src/app/services/location.service';
import { Argument } from 'src/app/interfaces/argument';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'argument-edits',
  templateUrl: './argument-edits.component.html',
  styleUrls: ['./argument-edits.component.scss']
})
export class ArgumentEditComponent implements OnInit {
  @Input() argument!:Argument;
  @Input() topicId!:string;

  constructor(private TopicArgumentService: TopicArgumentService, private Notification: NotificationService, private Location: LocationService, private Translate: TranslateService) { }

  ngOnInit(): void {
    console.log(this.argument.edits);
  }


  copyArgumentLink(event: MouseEvent, version:string) {
    const id = this.argument.id + '_v' + version;
    const url = this.Location.getAbsoluteUrl('/topics/:topicId', { topicId: this.topicId }, { argumentId: id });
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
}
