import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';
import { GroupCreateDialogComponent } from '../group/components/group-create/group-create.component';
import { GroupSettingsDialogComponent } from '../group/components/group-settings/group-settings.component';
import { MyGroupComponent } from './components/my-group/my-group.component';
import { MyGroupsComponent } from './my-groups.component';

const routes: Routes = [
  {
    path: '', component: MyGroupsComponent, children: [
      { path: 'create', component: GroupCreateDialogComponent },
      {
        path: ':groupId', children: [
          { path: '', component: MyGroupComponent, outlet: 'mygroupsright' },
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
