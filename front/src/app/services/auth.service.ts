import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';
  private isAdmin=false;

  constructor(private httpClient:HttpClient, private router: Router) { }

  createUser(email: string, password: string,firstname:string, lastname:string) {
    return this.httpClient.post<{ message: string }>('http://localhost:3000/api/auth/signup', {email: email, password: password, firstName:firstname,lastName:lastname},{withCredentials:true});
  }

// *********************************************
getToken() {
  return this.authToken;
}
// ***************************************************
getUserId() {
  return this.userId;
}
// *************************************************************
getAdmin() {
  return this.isAdmin;
}
loginUser(email: string, password: string) {
  return this.httpClient.post<{ userId: string,isAdmin:boolean, token: string }>('http://localhost:3000/api/auth/login', {email: email, password: password}).pipe(
    tap(({ userId,isAdmin, token }) => {
      console.log(isAdmin, userId);
      this.userId = userId;
      this.authToken = token;
      this.isAdmin=isAdmin;
      this.isAuth$.next(true);
    })
  );
}
logout() {
  this.authToken = '';
  this.userId = '';
  this.isAuth$.next(false);
  this.router.navigate(['login']);
}
}
