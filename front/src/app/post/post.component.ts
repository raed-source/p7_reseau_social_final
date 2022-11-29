import { Component, Input, OnInit } from '@angular/core';
import {Post} from '../models/post-model';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router, private route:ActivatedRoute) {}
  ngOnInit(): void {
    const postId = +this.route.snapshot.params['id'];    

    // this.buttonText='Like';
    // this.buttonDelete='Delete';
  }

  // ***********************************************************************************
  
  // liked(){
  //   if(this.buttonText==='DisLike'){
  //     this.postService.likedPostById(this.post._id, 'DisLike');
  //     this.buttonText='Like';
  //   }else{
  //     this.postService.likedPostById(this.post._id, 'Like');
  //     this.buttonText='DisLike';

  //   }
  // }



  onViewPost() {
    console.log(this.post);

    this.router.navigateByUrl(`posts/${this.post._id}`);
    
}
}
