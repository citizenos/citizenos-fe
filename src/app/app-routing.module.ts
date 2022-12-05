import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { ListComponent } from './my-topics/components/list/list.component';
import { MyTopicComponent } from './my-topics/components/my-topic/my-topic.component';

const routes: Routes = [
  {
    path: ':lang',
    children: [
      {path: 'my', component: ListComponent, children: [
        {path: 'topics', component: MyTopicComponent}
      ]},
      {path: 'account', children: [
      ]},
      {path: '', component: HomeComponent},
      {path: 'topics/categories/:category', component: HomeComponent},
      {path: ':category', component: HomeComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
