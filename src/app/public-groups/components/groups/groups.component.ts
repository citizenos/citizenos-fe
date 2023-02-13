import { Group } from 'src/app/interfaces/group';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { PublicGroupService } from 'src/app/services/public-group.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GroupCreateComponent } from 'src/app/group/components/group-create/group-create.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  allGroups$: Group[] = [];
  groups$ = of(<Group[] | any[]>[]);
  constructor(private dialog: MatDialog, private route: ActivatedRoute, private AuthService: AuthService, private GroupService: GroupService, public PublicGroupService: PublicGroupService, private FormBuilder: FormBuilder) {
    this.PublicGroupService.reset();
    this.groups$ = this.PublicGroupService.loadItems().pipe(map(
      (newgroups: any) => {
        this.allGroups$ = this.allGroups$.concat(newgroups);
        return this.allGroups$;
      }
    ))
  }

  loggedIn() {
    return this.AuthService.loggedIn$.value;
  }
  ngOnInit(): void {
  }

  createGroup() {
    this.dialog.open(GroupCreateComponent, {
      data: {
        visibility: this.GroupService.VISIBILITY.public
      }
    })
  }
}
