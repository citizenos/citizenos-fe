import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupSettingsDialogComponent } from './components/group-settings-dialog/group-settings-dialog.component';
import { GroupComponent } from './group.component';

const routes: Routes = [
  {path: '', children: [
    {path: ':groupId', component: GroupComponent, children: [
      {path: 'settings', component: GroupSettingsDialogComponent},
    ]}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
