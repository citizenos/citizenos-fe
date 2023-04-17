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
  templateUrl: './register-dialog.component.html'
})
export class RegisterDialogComponent {

  constructor() {

  }


}