import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '@services/notification.service';
import { LocationService } from '@services/location.service';
import { Argument } from 'src/app/interfaces/argument';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'argument-edits',
  templateUrl: './argument-edits.component.html',
  styleUrls: ['./argument-edits.component.scss']
})
export class ArgumentEditComponent {
  @Input() argument!:Argument;
  @Input() topicId!:string;
  @Input() showEdits!: boolean;
  @Output() showEditsChange = new EventEmitter<boolean>();

  constructor(private readonly Notification: NotificationService, private readonly Location: LocationService, private readonly Translate: TranslateService) { }

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

    this.Notification.inline(this.Translate.instant('VIEWS.TOPICS_TOPICID.ARGUMENT_LNK_COPIED'), event.pageX, event.pageY - 35);
  };

  hideEdits() {
    this.showEditsChange.emit(false);
  }
}
