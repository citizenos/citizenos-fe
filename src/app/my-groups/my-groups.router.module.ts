import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes, UrlSegment } from '@angular/router';
import { GroupCreateComponent } from '../group/components/group-create/group-create.component';
import { MyGroupsComponent } from './my-groups.component';

const routes: Routes = [
  { path: 'create', component: GroupCreateComponent },
  {
    path: '', component: MyGroupsComponent, children: [
      {
        path: ':groupId', children: [
          {
            path: 'settings', children: [
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
