import { Component, Input, OnInit } from '@angular/core';
import {Post} from '../models/post-model';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
@Input() post!:Post;

  buttonText!:string;
  buttonDelete!:string;
  constructor(private postService: PostService,
    private router: Router) {}
  ngOnInit(): void {

    this.buttonText='Like';
    this.buttonDelete='Delete';
  }

  // ***********************************************************************************
  
  // liked(){
  //   if(this.buttonText==='DisLike'){
  //     this.postService.likedPostById(this.post.id, 'DisLike');
  //     this.buttonText='Like';
  //   }else{
  //     this.postService.likedPostById(this.post.id, 'Like');
  //     this.buttonText='DisLike';

  //   }
  // }
  // `posts/${this.post.id}`
  onViewPost(id:number) {
    console.log(this.post);
    this.router.navigate(['post', Number(id)]);
}
}
