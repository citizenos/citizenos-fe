import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { GroupService } from 'src/app/services/group.service';
import { GroupInviteUserService } from 'src/app/services/group-invite-user.service';
import { AppService } from 'src/app/services/app.service';
import { Subscription, take } from 'rxjs';
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
  constructor(private Route: ActivatedRoute, private ref: ChangeDetectorRef, private dialog: MatDialog, public GroupService: GroupService, private GroupInviteUserService: GroupInviteUserService, public app: AppService) {
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
    })
    /*   .then((data) => {
         if (this.imageFile?.length) {
           this.sUpload
             .uploadGroupImage(this.imageFile[0], this.group.id)
             .then((response) => {
               this.group.imageUrl = response.data.link;
             }, (err) => {
               this.errors = err;
             });

         }

         angular.extend(this.group, data);
       })
       .then(() => {
         this.GroupInviteUserService.reload();
         const dialogs = this.ngDialog.getOpenDialogs();
         this.ngDialog.close(dialogs[0], '$closeButton');
       }), ((errorResponse) => {
         if (errorResponse.data && errorResponse.data.errors) {
           this.errors = errorResponse.data.errors;
         }
       });*/
  };

  doDeleteGroup() {
    /*  this.ngDialog
        .openConfirm({
          template: '/views/modals/group_delete_confirm.html'
        })
        .then(() => {
          this.GroupService
            .delete(this.group)
            .then(() => {
              this.GroupService.reload();
              this.$state.go('my/groups', null, { reload: true });
            });
        }, angular.noop);*/
  };
}
