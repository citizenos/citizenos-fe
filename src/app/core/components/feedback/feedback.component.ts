import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  name = '';
  email = '';
  org = '';
  message = '';
  allowContact = false;
  error = false;
  isSubmitted = false;

  constructor(private http: HttpClient, private Location: LocationService, private translate: TranslateService, private Notification: NotificationService) { }

  ngOnInit(): void {
  }

  submitFeedback() {
    this.error = false;
    const q1 = this.translate.instant('MODALS.GIVE_FEEDBACK_QUESTION_1');
    const q2 = this.translate.instant('MODALS.GIVE_FEEDBACK_QUESTION_2');
    const path = this.Location.getAbsoluteUrlApi('/api/internal/feedback');
    if (!this.message) {
      this.error = true;
    }
    if (this.error) return;
    let allowContact = 'No';
    if (this.allowContact) {
      allowContact = 'Yes';
    }
    const finalMessage = `
    Name: ${this.name}
    Email: ${this.email}
    Group/Organization: ${this.org}
    ${q1}
    ${this.message}
    ${q2}
    ${allowContact}
    `;
    return this.http.post(path, { message: finalMessage }).pipe(take(1)).subscribe({
      next: () => {
        this.isSubmitted = true;
      },
      error: (err) => {
        console.error(err);
        this.Notification.addError(err.message);
      }
    });
  }
}
