import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './posts.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}
  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://angularhttprequest-2169f-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angularhttprequest-2169f-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map((responseData) => {
          console.log(responseData);
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }
  deletePosts() {
    return this.http.delete(
      'https://angularhttprequest-2169f-default-rtdb.firebaseio.com/posts.json'
    );
  }
}
