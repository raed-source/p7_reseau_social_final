import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import{Comment } from '../models/comment-model';
import { PostService } from '../services/post.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comments!: Comment[];
  commentCtrl!: FormControl;
  @Output() newComment = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder, postService:PostService) { }

  ngOnInit(): void {
this.commentCtrl=this.formBuilder.control('',[Validators.required,Validators.minLength(10)]);
  }
  onLeaveComment() {
    if(this.commentCtrl.invalid){
      return;
    }
this.newComment.emit(this.commentCtrl.value);
this.commentCtrl.reset();
}

}
