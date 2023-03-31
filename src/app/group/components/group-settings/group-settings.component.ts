import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { GroupService } from 'src/app/services/group.service';
import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { AppService } from 'src/app/services/app.service';
import { switchMap, take, takeWhile } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { Group } from 'src/app/interfaces/group';
@Component({
  selector: 'group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss']
})
export class GroupSettingsComponent implements OnInit {
  @ViewChild('imageUpload') fileInput?: ElementRef;
  public group!: Group;
  public imageFile?: any;
  public tmpImageUrl?: any;
  public errors: any = null;
  public sectionsVisible = ['name', 'description', 'image', 'leave'];
  // private sUpload,
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<GroupSettingsComponent>,
    private Route: ActivatedRoute, private dialog: MatDialog,
    public GroupService: GroupService, private GroupInviteUserService: GroupInviteUserService,
    private Upload: UploadService,
    public app: AppService) {
      this.group = data.group;
  }

  ngOnDestroy() {
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
      if (this.imageFile) {
        this.GroupService
          .uploadGroupImage(this.imageFile, this.group.id).pipe(
            takeWhile((e) => !e.link)
          )
          .subscribe((res: any) => {
            if (res.link) {
              this.group.imageUrl = res.link;
            }
          });
      }

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

@Component({
  selector: 'group-settings-dialog',
  template: ''
})
export class GroupSettingsDialogComponent implements OnInit {

  constructor(dialog: MatDialog, router: Router, route: ActivatedRoute, GroupService: GroupService) {
    route.params.pipe(
      switchMap((params) => {
        return GroupService.get(params['groupId'])
      })
    ).pipe(take(1)).subscribe((group) => {
      const settingsDialog = dialog.open(GroupSettingsComponent, {
        data: {
          group
        }
      });
      settingsDialog.afterClosed().subscribe(() => {
        router.navigate(['../'], { relativeTo: route })
      })
    });
  }

  ngOnInit(): void {
  }

}