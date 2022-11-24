import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { PostListComponent } from './post-list/post-list.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { NewPostComponent } from './new-post/new-post.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {path:'signup',component:SignUpComponent},
  {path:'login' ,component:LogInComponent},
  { path:'posts',component:PostListComponent, canActivate: [AuthGuard]},
  // {
  //   path:'',component:HomeComponent
  // },
  {path:'posts/:id', component:SinglePostComponent, canActivate: [AuthGuard]},
  { path: 'create', component: NewPostComponent, canActivate: [AuthGuard]},
  {path: '', pathMatch: 'full', redirectTo: 'posts' },
  {path: '**', redirectTo: 'posts' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
