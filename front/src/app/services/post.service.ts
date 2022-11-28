import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post-model";
import { catchError, map, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from "./auth.service";
@Injectable({
  providedIn:'root'
})
export class PostService{
  constructor(private http:HttpClient, private auth:AuthService){}
  // posts:Post[]=[];
  posts$ = new Subject<Post[]>();

  // ******************************************************************

getAllPosts() {
  let token= this.auth.getToken(); 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
});
  return this.http.get<Post[]>('http://localhost:3000/api/posts',{ headers: headers}).pipe(
    tap(posts=>this.posts$.next(posts)),
    catchError(error => {
      console.error(error.error.message);
      return of([])
    })
  ).subscribe();
}
// ********************************************************************
getPostById(id:any) {
  let token= this.auth.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<Post>('http://localhost:3000/api/posts/' + id,{ headers: headers}).pipe(
      catchError(error => throwError(error.error.message))
    );

  // return this.http.get<Post>(`http://localhost:3000/posts/${id}`)
}
// ************************************************************************
likedPostById(id: number, likeType:string){
//   const post = this.getPostById(id); // à remplacer par un Observable
//  likeType==='Like'?post.like='Ok':post.like='';
  return this.getPostById(id).pipe(
    map(post=>({
      ...post,
      like:likeType==='Like'?'ok':''
    })),
    switchMap(updatePost=>this.http.put<Post>(`http://localhost:3000/posts/${id}`,updatePost))
  )
}
// ********************************************************************

disLikedById(id: number, dislikeType:string): void {
  const post = this.getPostById(id).pipe(
    map(post=>({
      ...post,
      dislike:dislikeType==='Like'?'ok':''
    })),
    switchMap(updatePost=>this.http.put<Post>(`http://localhost:3000/posts/${id}`,updatePost))

  );
  }

// ****************************************************************************
// const post = this.posts.find(post => post.id === id);
// if (post) {
  //     post.like='';
  // } else {
    //     throw new Error('Post not found!');
    // }
    
    // ********************************************************************
    createPost(post: Post) {
      let token= this.auth.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      return this.http.post<{ message: string }>('http://localhost:3000/api/posts', post,{headers:headers}).pipe(
        catchError(error => throwError(error.error.message))
        );
      }
      // ************************************************
      deletePost(id: number) {
        let token= this.auth.getToken();
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + id,{headers:headers}).pipe(
          catchError(error => throwError(error.error.message))
        );
      }
      // **************************************************************
       modifyPost(id: number, post: Post, imgUrl: string | File) {
        let token= this.auth.getToken();
        const headers = new HttpHeaders({
           'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    if (typeof imgUrl === 'string') {
      return this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post,{headers:headers}).pipe(
        catchError(error => throwError(error.error.message))
      );
    } else {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('imgUrl', imgUrl);
      return this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, formData,{headers:headers}).pipe(
        catchError(error => throwError(error.error.message))
      );
    }
  }
      
      // addPost(formValue:{ title: string, content: string, imgUrl: string, location?: string }):Observable<Post>{
        //   return this.getAllPosts().pipe(
          //     map(posts=>[...posts].sort((a:Post,b:Post)=>a.id-b.id)),
          //     map(sortedPosts=>sortedPosts[sortedPosts.length-1]),
          //     map(previousPost=>({
//       ...formValue,
//       like:'',
//       dateCreat:new Date(),
//       id:previousPost.id+1
//     })),
//     switchMap(newPost=>this.http.post<Post>('http://localhost:3000/posts',newPost))
//   )
// const post:Post={
//   ...formValue,
//   dateCreate:new Date,
//   like:'0',
//   dislike:'0',
//   id:this.posts[this.posts.length-1].id+1,
//   userId : this.auth.getUserId()

// }
// this.posts.push(post);
// }


}
