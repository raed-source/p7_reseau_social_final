import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;
  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required]
      });
    }

    onLogin() {
      this.loading = true;
      const email = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;
      this.auth.loginUser(email, password).pipe(
        tap(() => {
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
}
