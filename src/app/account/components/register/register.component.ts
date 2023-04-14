import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor () {}
}

@Component({
  selector: 'app-register-dialog',
  template: '',
})
export class RegisterDialogComponent implements OnInit {

  constructor(dialog: MatDialog, route: ActivatedRoute, private router: Router) {
    const params = Object.assign({}, route.snapshot.params);
    const registerDialog = dialog.open(RegisterComponent, {
      data: Object.assign(params, {redirectSuccess: route.url})
    });
    registerDialog.afterClosed().subscribe(() => {
      this.router.navigate(['/']);
    })
  }

  ngOnInit(): void {
  }

}