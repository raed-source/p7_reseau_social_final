import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { HttpResponse } from '../../interfaces/http-response';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }


              ngOnInit() {
                this.signupForm = this.formBuilder.group({
                  firstname:[null,[Validators.required]],
                  lastname:[null,[Validators.required]],
                  email: [null, [Validators.required, Validators.email]],
                  password: [null, Validators.required]
                });
              }
              onSignup() {
                this.loading = true;
                const firstname=this.signupForm.get('firstname')!.value;
                const lastname=this.signupForm.get('lastname')!.value;
                const email = this.signupForm.get('email')!.value;
                const password = this.signupForm.get('password')!.value;
                this.auth.createUser(email, password,firstname,lastname).pipe(
                  switchMap(() => this.auth.loginUser(email, password)),
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
