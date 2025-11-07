import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '@interfaces/topic';
import { TopicService } from '@services/topic.service';
import { DialogService } from '@shared/dialog';
import { TopicParticipantsComponent } from '../topic-participants/topic-participants.component';
import { TopicInviteDialogComponent } from '../topic-invite/topic-invite.component';

@Component({
  selector: 'topic-participants-section',
  templateUrl: './topic-participants-section.component.html',
  styleUrls: ['./topic-participants-section.component.scss'],
  standalone: false
})
export class TopicParticipantsSectionComponent {
  @Input() topic!: Topic;
  @Input() members$!: Observable<any[]>;

  constructor(
    public TopicService: TopicService,
    private readonly DialogService: DialogService
  ) {}

  canUpdate(topic: Topic): boolean {
    return this.TopicService.canUpdate(topic);
  }

  manageParticipants(topic: Topic): void {
    const participantsDialog = this.DialogService.open(
      TopicParticipantsComponent,
      { data: { topic } }
    );
    participantsDialog.afterClosed().subscribe({
      next: (res) => {
        // Handle response if needed
      },
      error: (error) => {
        console.error('Error managing participants', error);
      },
    });
  }

  inviteMembers(topic: Topic): void {
    const inviteDialog = this.DialogService.open(TopicInviteDialogComponent, {
      data: { topic },
    });
    inviteDialog.afterClosed().subscribe({
      next: (res) => {
        // Handle response if needed
      },
      error: (error) => {
        console.error('Error inviting members', error);
      },
    });
  }
}

