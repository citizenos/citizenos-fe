import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';
import { GroupCreateDialogComponent } from '../group/components/group-create/group-create.component';
import { GroupSettingsDialogComponent } from '../group/components/group-settings/group-settings.component';
import { MyGroupsComponent } from './my-groups.component';
import { GroupListComponent } from './components/group-list/group-list.component';

const routes: Routes = [
  {
    path: '', component: MyGroupsComponent, children: [
      { path: '', component: GroupListComponent },
      { path: 'create', component: GroupCreateDialogComponent },
      {
        path: ':groupId', children: [
          { path: '', component: GroupListComponent },
          {
            path: 'settings', children: [
              { path: '', component: GroupSettingsDialogComponent }
            ]
          },
          /*{
            path: 'invite', children: [
              { path: '', component: TopicInviteDialogComponent }
            ]
          },
          */
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyGroupsRoutingModule {
  constructor(router: Router) {
  }
}
