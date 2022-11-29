import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post-model';
import { catchError, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  userId!:string;
  post$!:Observable<Post>
  buttonText!:string;
  loading!: boolean;
  errorMessage: any;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  constructor(private postService: PostService,
    private route: ActivatedRoute, private router:Router,private auth:AuthService) { }


    ngOnInit(): void {
      this.userId=this.auth.getUserId();
      this.loading = true;
      this.post$ = this.route.params.pipe(
        map(params => params['id']),
        switchMap(id => this.postService.getPostById(id)),
        tap(post => {
          this.loading = false;
          if (post.usersLiked.find(user => user === this.userId)) {
            this.liked = true;
          } else if (post.usersDisliked.find(user => user === this.userId)) {
            this.disliked = true;
          }
        })
      );
    }
    
    onModify(){
      console.log(this.post$);
      this.post$.pipe(
        take(1),
        tap(post => this.router.navigate(['/modify-post', post._id]))
      ).subscribe();
    }

    onDelete(){
      this.loading = true;
    this.post$.pipe(
      take(1),
      switchMap(post => this.postService.deletePost(post._id)),
      tap(message => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/posts']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
    }
// ******************like methode************************
    onLike(){
      if (this.disliked) {
        return;
      }
      this.likePending = true;
      this.post$.pipe(
        take(1),
        switchMap((post: Post) => this.postService.likePost(post._id, !this.liked).pipe(
          tap(liked => {
            this.likePending = false;
            this.liked = liked;
          }),
          map(liked => ({ ...post, likes: liked ? post.likes + 1 : post.likes - 1 })),
          tap(post => this.post$ = of(post))
        )),
      ).subscribe();
    }
    // ******************dislike methode***********
onDislike(){
  if (this.liked) {
    return;
  }
  this.likePending = true;
  this.post$.pipe(
    take(1),
    switchMap((post: Post) => this.postService.dislikePost(post._id, !this.disliked).pipe(
      tap(disliked => {
        this.likePending = false;
        this.disliked = disliked;
      }),
      map(disliked => ({ ...post, dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1 })),
      tap(post => this.post$ = of(post))
    )),
  ).subscribe();
}

// method like*****************************
// liked(id:number){
//   if(this.buttonText==='DisLike'){
//     this.postService.likedPostById(id, 'DisLike').pipe(
//       tap(()=>{
//         this.post$=this.postService.getPostById(id);
//         this.buttonText='Like';
//       })
//     ).subscribe();
//   }else{
//     this.postService.likedPostById(id, 'Like').pipe(
//       tap(()=>{
//         this.post$=this.postService.getPostById(id);
//         this.buttonText='DisLike'
//       })
//     ).subscribe();
//     this.buttonText='DisLike';

//   }
// }
}
