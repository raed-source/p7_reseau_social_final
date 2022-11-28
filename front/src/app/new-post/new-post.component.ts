import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { Post } from '../models/post-model';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  postForm!: FormGroup;
  postPreview$!: Observable<Post>;
  urlRegex!: RegExp;
  loading!: boolean;
  mode!: string;
  post!: Post;
  errorMsg!: string;
  imagePreview!: any;

  constructor(private formBuilder: FormBuilder,
    private postService:PostService, 
    private router:Router, 
    private route:ActivatedRoute, 
    private auth:AuthService) {this.initEmptyForm()  }


// *****************************************************
  ngOnInit(): void {
//     this.urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
//     this.postForm = this.formBuilder.group({
//         title: [null,[Validators.required]],
//         content: [null,[Validators.required]],
//         imgUrl: [null,[Validators.required, Validators.pattern(this.urlRegex)]],
//         location: [null,[Validators.required]]
//     }, {
//       updateOn: 'blur'
//   });
//     this.postPreview$= this.postForm.valueChanges.pipe(
//       map(formValue => ({
//           ...formValue,
//           dateCreate: new Date(),
//           like: "",
//           dislike:"",
//           id: 0
//       }))
//   );
// }
// ************************************************************************************


this.loading = true;
this.route.params.pipe(
  switchMap(params => {
    if (!params['id']) {
      this.mode = 'new';
      this.initEmptyForm();
      this.loading = false;
      return EMPTY;
    } else {
      this.mode = 'edit';
      return this.postService.getPostById(params['id'])
    }
  }),
  tap(post => {
    if (post) {
      this.post = post;
      this.initModifyForm(post);
      this.loading = false;
    }
  }),
  catchError(error => this.errorMsg = JSON.stringify(error))
).subscribe();
}

initEmptyForm() {
this.postForm = this.formBuilder.group({
  title: [null, Validators.required],
  content: [null, Validators.required],
  imgUrl: [null],
  location:[null]
});

}
initModifyForm(post: Post) {
  this.postForm = this.formBuilder.group({
    title: [post.title, Validators.required],
    content: [post.content, Validators.required],
    imgUrl: [post.imgUrl, Validators.required],
    location:[post.location]
  });

  this.imagePreview = this.post.imgUrl;
}

onSubmitForm() {
  
  this.loading = true;
  const newPost= new Post();
  newPost.title=this.postForm.get('title')!.value;
  newPost.content=this.postForm.get('content')!.value;
  newPost.imgUrl=this.postForm.get('imgUrl')!.value;
  newPost.location=this.postForm.get('location')!.value;

  // newPost.dateCreate=this.postForm.get('dateCreat')!.value;
  newPost.userId = this.auth.getUserId();
  console.log(newPost);
  if (this.mode === 'new') 
  {
    this.postService.createPost(newPost).pipe(
      tap(({ message }) => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/posts']);
      }),
      catchError(error => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
        return EMPTY;
      })
    ).subscribe();
    }
    else if (this.mode === 'edit')
    {
      this.postService.modifyPost(this.post._id, newPost, this.postForm.get('imgUrl')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }

    // console.log(this.postForm.value);
    // // this.postService.addPost(this.postForm.value);
    // // this.router.navigateByUrl('/posts');
    // const newPost= new Post;
    // newPost.title=this.postForm.get('title')!.value;
    // newPost.content=this.postForm.get('content')!.value;
    // newPost.location=this.postForm.get('title')!.value;
    // newPost.imgUrl=this.postForm.get('imgUrl')!.value;

    // this.postService.createPost(newPost,this)

    // this.postService.addPost(this.postForm.value).pipe(
    //   tap(()=>this.router.navigateByUrl('/posts'))
    // ).subscribe();


}
}
