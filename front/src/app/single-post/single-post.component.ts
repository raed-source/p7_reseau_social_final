import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../models/post-model';
import { Observable, tap } from 'rxjs';
@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  post$!:Observable<Post>
  buttonText!:string;

  constructor(private postService: PostService,
    private route: ActivatedRoute) { }


    ngOnInit(): void {
      const postId = +this.route.snapshot.params['id'];
      this.buttonText='Like';
      this.post$ = this.postService.getPostById(postId);
    }
    // method like*****************************
    liked(id:number){
      if(this.buttonText==='DisLike'){
        this.postService.likedPostById(id, 'DisLike').pipe(
          tap(()=>{
            this.post$=this.postService.getPostById(id);
            this.buttonText='Like';
          })
        ).subscribe();
      }else{
        this.postService.likedPostById(id, 'Like').pipe(
          tap(()=>{
            this.post$=this.postService.getPostById(id);
            this.buttonText='DisLike'
          })
        ).subscribe();
        this.buttonText='DisLike';

      }
    }


}
