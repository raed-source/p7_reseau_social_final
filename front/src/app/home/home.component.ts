import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userEmail!: string;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  onContinue(): void {
    this.router.navigateByUrl('posts');
  }
  onSubmitForm(form: NgForm) {
    console.log(form.value);
}
}
