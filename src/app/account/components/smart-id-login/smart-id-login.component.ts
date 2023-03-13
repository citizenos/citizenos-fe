import { Component, OnInit } from '@angular/core';
import { catchError, interval, map, of, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-id-login',
  templateUrl: './smart-id-login.component.html',
  styleUrls: ['./smart-id-login.component.scss']
})
export class SmartIdLoginComponent implements OnInit {
  smartIdForm = new UntypedFormGroup({
    pid: new UntypedFormControl('', Validators.compose([Validators.pattern(/^[0-9]{11}$/), Validators.required])),
    countryCode: new UntypedFormControl('', Validators.compose([Validators.pattern(/^[A-Z]{2}$/), Validators.required]))
  });
  pid?: string;
  countryCode = 'EE';
  challengeID?: number | null;
  isLoading = false;
  constructor(private AuthService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  authSmartId() {
    console.debug('LoginSmartIdController.authSmartId()');

    this.isLoading = true;
    if (this.smartIdForm.value.pid && this.smartIdForm.value.countryCode) {

      this.isLoading = true;
      this.AuthService
        .loginSmartIdInit({ pid: this.smartIdForm.value.pid, countryCode: this.smartIdForm.value.countryCode }) //,this.$stateParams.userId
        .pipe(take(1))
        .subscribe({
          next: (loginSmartIdInitResult) => {
            this.isLoading = false;
            if (loginSmartIdInitResult.challengeID && loginSmartIdInitResult.token) {
              this.challengeID = loginSmartIdInitResult.challengeID;
              const token = loginSmartIdInitResult.token;
              return this.pollSmartIdLoginStatus(token, 3000, 80);
            }
          }, error: (err) => {
            this.isLoading = false;
            this.challengeID = null;
            console.error(err);
          }
        })
    }
  };

  pollSmartIdLoginStatus(token: string, milliseconds: number, retry: number) {
    const delay = interval(milliseconds);
    this.isLoading = true;
    const authResult = delay.pipe(
      switchMap((data) => {
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
