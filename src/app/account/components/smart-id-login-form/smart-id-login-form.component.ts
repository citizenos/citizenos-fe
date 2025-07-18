import { Component, Input, Inject } from '@angular/core';
import { Subscriber, Subscription, catchError, interval, of, switchMap, take, takeWhile } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { DialogService } from 'src/app/shared/dialog';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'smart-id-login-form',
  templateUrl: './smart-id-login-form.component.html',
  styleUrls: ['./smart-id-login-form.component.scss'],
  standalone: false
})
export class SmartIdLoginFormComponent {
  @Input() redirectSuccess?: any;

  smartIdForm = new UntypedFormGroup({
    pid: new UntypedFormControl('', Validators.compose([Validators.pattern(/^[0-9]{11}$/), Validators.required])),
    countryCode: new UntypedFormControl('EE', Validators.compose([Validators.pattern(/^[A-Z]{2}$/), Validators.required]))
  });
  pid?: string;
  countryCode = 'EE';
  challengeID?: number | null;
  isLoading = false;
  ccSubscriber?:Subscription;
  constructor(private AuthService: AuthService, private dialog: DialogService, @Inject(ActivatedRoute) private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(value => {
      this.redirectSuccess = this.redirectSuccess || value['redirectSuccess'];
    });
    this.ccSubscriber = this.smartIdForm.get('countryCode')?.valueChanges.subscribe(value => {
      if (value && value !== value.toUpperCase()) {
        this.smartIdForm.get('countryCode')?.patchValue(value.toUpperCase());
      }
   });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ccSubscriber?.unsubscribe();
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
      }, true)).subscribe({
        next: (response) => {
          if (response) {
            this.isLoading = false;
            this.challengeID = null;
            this.AuthService.reloadUser();
            this.dialog.closeAll();
            if (this.redirectSuccess) {
              if (typeof this.redirectSuccess === 'string') {
                /**
                 * Currently redirectSuccess is an absolute url.
                 * However, router.navigateByUrl cannot properly navigate to such absolute url,
                 * the reason can be counnected to some other issue in this specific case.
                 * As a quick fix set location href directly.
                 *
                 * @note Think of making redirectSuccess relative. This way router.navigate
                 * should work as expected.
                 */
                window.location.href = this.redirectSuccess;
              }
            } else {
              window.location.reload();
            }
          }
        }, error: (err) => {
          this.isLoading = false;
          this.challengeID = null;
          console.error(err);
        }
      });
  };

  countryCodeChange () {
  }
}
