import { Component, OnInit, Inject, inject } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { RegisterComponent } from 'src/app/account/components/register/register.component';
import { InviteData } from 'src/app/interfaces/dialogdata';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicInviteUserService } from 'src/app/services/topic-invite-user.service';

@Component({
  selector: 'app-topic-invitation',
  templateUrl: './topic-invitation.component.html',
  styleUrls: ['./topic-invitation.component.scss']
})
export class TopicInvitationComponent implements OnInit {
  invite: any;
  config = <any>this.ConfigService.get('links');
  constructor(private ConfigService: ConfigService, private dialog: DialogService, @Inject(DIALOG_DATA) private data: InviteData, private Auth: AuthService, private Location: LocationService, private router: Router) {
    this.invite = data.invite;
  }

  loggedIn () {
    return this.Auth.loggedIn$.value;
  }

  doAccept() {
    // 3. The invited User is NOT logged in - https://github.com/citizenos/citizenos-fe/issues/112#issuecomment-541674320
    console.log(this.Auth.loggedIn$.value, this.invite.user)
    if (!this.Auth.loggedIn$.value) {
      const currentUrl = this.Location.currentUrl();
      if (!this.invite.user.isRegistered) {
        // The invited User is not registered, the User has been created by the system - https://github.com/citizenos/citizenos-fe/issues/773
        this.router.navigate(['/account','signup'], {
          queryParams: {
            inviteId: this.invite.id,
            redirectSuccess: currentUrl,
            email: this.invite.user.email
          }
        });
      } else {
        this.router.navigate(['/account/login'], {
          queryParams: {
            userId: this.invite.user.id,
            redirectSuccess: currentUrl,
            email: this.invite.user.email
          }
        });
        /*return $state.go('account/login', {
            userId: $scope.invite.user.id,
            redirectSuccess: currentUrl,
            email: $scope.invite.user.email // HACK: Hidden e-mail from the URL and tracking - https://github.com/citizenos/citizenos-fe/issues/657
        });*/
      }
    }

    // 2. User logged in, but opens an invite NOT meant to that account  - https://github.com/citizenos/citizenos-fe/issues/112#issuecomment-541674320
    if (this.Auth.loggedIn$.value && this.invite.user.id !== this.Auth.user.value.id) {
      this.Auth
        .logout()
        .pipe(take(1))
        .subscribe(() => {
          const currentUrl = this.Location.currentUrl();
          this.router.navigate(['/account/login'], {
            queryParams: {
              userId: this.invite.user.id,
              redirectSuccess: currentUrl,
              email: this.invite.user.email
            }
          });

        });
    }
  };
  ngOnInit(): void {
  }

}


@Component({
  selector: 'topic-invite-dialog',
  template: '',
})
export class TopicInvitationDialogComponent implements OnInit {
  inviteId: string = '';

  constructor(Auth: AuthService, dialog: DialogService, TopicInviteUserService: TopicInviteUserService, route: ActivatedRoute, router: Router, Notification: NotificationService) {

    /*LOAD INVITE*/
    route.params.pipe(
      take(1),
      switchMap((params: any) => {
        this.inviteId = params['inviteId'];
        return TopicInviteUserService.get(params)
      })
    ).subscribe({
      next: (topicInvite: any) => {
        topicInvite.inviteId = this.inviteId;
        // 1. The invited User is logged in - https://github.com/citizenos/citizenos-fe/issues/112#issuecomment-541674320
        if (Auth.loggedIn$.value && topicInvite.user.id === Auth.user.value.id) {
          TopicInviteUserService
            .accept(topicInvite)
            .pipe(take(1))
            .subscribe({
              next: () => {
                router.navigate(['/topics', topicInvite.topicId])
              },
              error: (err) => {
                console.error('Invite error', err)
              }
            });
        } else {
          const openDialogs = dialog.getOpenDialogs().pipe(take(1)).subscribe({
            next: (dialogs) => {
              if (dialogs) {
                console.log(dialogs);
              }

              const invitationDialog = dialog.open(TopicInvitationComponent,
                {
                  data: {
                    invite: topicInvite
                  }
                });

                invitationDialog.afterClosed().subscribe({
                  next: (res) => {
                    if (res===true) {
                      router.navigate(['/']);
                    }
                  }
                })
            }
          });

        }
      },
      error: (err) => {
        if (err.status === 404) {
          Notification.removeAll();
          Notification.showDialog('MSG_ERROR_GET_API_USERS_TOPICS_INVITES_USERS_41002_HEADING', 'MSG_ERROR_GET_API_USERS_TOPICS_INVITES_USERS_41002');
          return;
        }
        return router.navigate(['/']);
      }
    })
  }

  ngOnInit(): void {
  }

}
