import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, interval, of, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-connect-smart-id',
  templateUrl: './connect-smart-id.component.html',
  styleUrls: ['./connect-smart-id.component.scss']
})
export class ConnectSmartIdComponent implements OnInit {
  pid?: string;
  countryCode = 'EE';
  challengeID?: number | null;
  isLoading = false;
  constructor(private AuthService: AuthService, private UserService: UserService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

  authSmartId() {
    console.debug('LoginSmartIdController.authSmartId()');

    this.isLoading = true;
    if (this.pid && this.countryCode) {

      this.isLoading = true;
      this.AuthService
        .loginSmartIdInit({pid: this.pid, countryCode: this.countryCode})
        .pipe(take(1),
          catchError((err) => {
            this.isLoading = false;
            this.challengeID = null;
            console.error(err);
            return of(err);
          }))
        .subscribe((loginSmartIdInitResult) => {
          this.isLoading = false;
          if (loginSmartIdInitResult.challengeID && loginSmartIdInitResult.token) {
            this.challengeID = loginSmartIdInitResult.challengeID;
            const token = loginSmartIdInitResult.token;
            return this.pollSmartIdLoginStatus(token, 3000, 80);
          }
        })
    }
  };

  pollSmartIdLoginStatus(token: string, milliseconds: number, retry: number) {
    const delay = interval(milliseconds);
    this.isLoading = true;
    const authResult = delay.pipe(
      switchMap((data) => {
        this.UserService.addUserConnection(this.AuthService.user.value?.id || '', 'smartid', token)
        return this.AuthService.loginSmartIdStatus(token);
      })
    );
    authResult.pipe(
      takeWhile((res: any,) => {
        return (!res || res.status?.code === 20001)
      }, true),
      catchError((error) => {
        console.error('ERROR', error);
        this.isLoading = false;
        this.challengeID = null;
        return of(error);
      })).subscribe((response) => {
        if (response) {
          this.isLoading = false;
          this.challengeID = null;
          this.AuthService.status().pipe(take(1)).subscribe();
          this.dialog.closeAll();
        }
      });
  };
}
