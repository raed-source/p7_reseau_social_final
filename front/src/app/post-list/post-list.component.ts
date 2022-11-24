import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post-model';
import { PostService } from '../services/post.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Post[]>;
  loading!: boolean;
  errorMsg!: string;
  // myPosts$!:Observable<Post[]>;
  constructor(private postService:PostService, private router:Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.posts$ = this.postService.posts$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.postService.getAllPosts();
 
        }
        onViewPost(id:number) {
          
           
              this.router.navigate(['post', Number(id)]);
          }

}

