import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post-model";
import { catchError, map, mapTo, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
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

likePost(id: string, like: boolean) {
  let token= this.auth.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.post<{ message: string }>(
    'http://localhost:3000/api/posts/' + id + '/like',
    { userId: this.auth.getUserId(), like: like ? 1 : 0 },{ headers: headers}
  ).pipe(
    mapTo(like),
    catchError(error => throwError(error.error.message))
  );
}
dislikePost(id: string, dislike: boolean) {
  let token= this.auth.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.post<{ message: string }>(
    'http://localhost:3000/api/posts/' + id + '/like',
    { userId: this.auth.getUserId(), like: dislike ? -1 : 0 },{ headers: headers}
  ).pipe(
    mapTo(dislike),
    catchError(error => throwError(error.error.message))
  );
}

// ********************************************************************

disLikedById(id: string, dislikeType:string): void {
  const post = this.getPostById(id).pipe(
    map(post=>({
      ...post,
      dislike:dislikeType==='Like'?'ok':''
    })),
    switchMap(updatePost=>this.http.put<Post>(`http://localhost:3000/posts/${id}`,updatePost))

  );
  }


    
    // ********************************************************************
    createPost(post: Post, image: File) {
      let token= this.auth.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data'
      });
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('image', image);
// remplacer post par formData
      return this.http.post<{ message: string }>('http://localhost:3000/api/posts', formData,{headers:headers}).pipe(
        catchError(error => throwError(error.error.message))
        );
      }
      // **************************************************************
       modifyPost(id: string, post: Post, image: string | File) {
        let token= this.auth.getToken();
        const headers = new HttpHeaders({
           'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        });
    if (typeof image === 'string') {
      return this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post,{headers:headers}).pipe(
        catchError(error => throwError(error.error.message))
      );
    } else {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('image', image);
      return this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + id, formData,{headers:headers}).pipe(
        catchError(error => throwError(error.error.message))
      );
    }
  }
  addNewComment(postCommented: { comment: string, postId: string }) {
    console.log(postCommented);
}
    
      // ************************************************
      deletePost(id: string) {
        let token= this.auth.getToken();
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + id,{headers:headers}).pipe(
          catchError(error => throwError(error.error.message))
        );
      }

}
