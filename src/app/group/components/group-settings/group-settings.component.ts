import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { GroupService } from 'src/app/services/group.service';
import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { AppService } from 'src/app/services/app.service';
import { Subscription, take, takeWhile } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
@Component({
  selector: 'group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss']
})
export class GroupSettingsComponent implements OnInit {
  @ViewChild('imageUpload') fileInput?: ElementRef;
  public group?: any;
  public imageFile?: any;
  public tmpImageUrl?: any;
  public errors: any = null;
  public sectionsVisible = ['name', 'description', 'image', 'leave'];
  subscription: Subscription;
  // private sUpload,
  constructor(
    public dialogRef: MatDialogRef<GroupSettingsComponent>,
    private Route: ActivatedRoute, private ref: ChangeDetectorRef, private dialog: MatDialog,
    public GroupService: GroupService, private GroupInviteUserService: GroupInviteUserService,
    private Upload: UploadService,
    public app: AppService) {
    this.subscription = this.app.group
      .subscribe((val) => this.group = val);
    this.ref.markForCheck();
    console.log('SETTINGS', this.group)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  ngOnInit(): void {
  }

  isVisible(section: string) {
    return this.sectionsVisible.indexOf(section) > -1;
  };

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }
  triggerUploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteGroupImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    this.group.imageUrl = this.tmpImageUrl = null;
    this.imageFile = null;
  };

  doSaveGroup() {
    this.errors = null;

    this.GroupService.update(this.group).pipe(
      take(1)
    ).subscribe((res) => {
      console.log('UPDATED res', res);
      this.GroupService
        .uploadGroupImage(this.imageFile, this.group.id).pipe(
          takeWhile((e) => !e.link)
        )
        .subscribe((res: any) => {
          if (res.link) {
            this.group.imageUrl = res.link;
          }
        });

        this.dialogRef.close();
    })
  };

  doDeleteGroup() {
    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        heading: 'MODALS.GROUP_DELETE_CONFIRM_HEADING',
        title: 'MODALS.GROUP_DELETE_CONFIRM_TXT_ARE_YOU_SURE',
        points: ['MODALS.GROUP_DELETE_CONFIRM_TXT_GROUP_DELETED', 'MODALS.GROUP_DELETE_CONFIRM_TXT_LOSE_ACCESS'],
        confirmBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_DELETE_CONFIRM_BTN_NO'
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupService.delete(this.group)
          .pipe(take(1))
          .subscribe((res) => {
            console.log(res);
          })
      }
    });
  };
}
