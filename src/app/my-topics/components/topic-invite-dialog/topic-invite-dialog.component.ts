import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, Subscription, combineLatest } from 'rxjs';
import { TopicInviteComponent } from 'src/app/topic/components/topic-invite/topic-invite.component';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'topic-invite-dialog',
  template: '',
})
export class TopicInviteDialogComponent implements OnInit {
  subscriber: Subscription;

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
      this.subscriber.unsubscribe();
  }
  constructor(private dialog: MatDialog, private TopicService: TopicService, private route: ActivatedRoute, private router: Router) {
    console.log('TopicInviteDialogComponent')
    this.subscriber = this.route.params.pipe(
      switchMap((params) => {
        return this.TopicService.get(params['topicId']);
      }),
    ).subscribe((topic:any) => {
      const inviteDialog = this.dialog.open(TopicInviteComponent, { data: { topic } });
      inviteDialog.afterClosed().subscribe((res)=> {
        this.router.navigate(['..'], {relativeTo: this.route});
      })
    })
  }

  ngOnInit(): void {
  }

}
