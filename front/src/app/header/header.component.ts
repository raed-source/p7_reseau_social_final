import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuth$!: Observable<boolean>;

  constructor(private auth: AuthService, private router:Router) { }

  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(
      shareReplay(1)
    );
  }
  onLogout() {
    this.auth.logout();
  }

  onAddNewPost() {
    this.router.navigateByUrl('/create');
  }
}
