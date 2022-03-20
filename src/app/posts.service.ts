import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './posts.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  errorSubject = new Subject<string>();
  constructor(private http: HttpClient) {}
  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://angularhttprequest-2169f-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          this.errorSubject.next(error.message);
        }
      );
  }
  fetchPosts() {
    let params = new HttpParams();
    params = params.append('SampleParam', 'hi');
    params = params.append('SampleParam2', 'hi2');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angularhttprequest-2169f-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: params,
          responseType: 'json',
        }
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
        }),
        catchError((errorRes) => {
          this.errorSubject.next(errorRes.message);
          return throwError(errorRes);
        })
      );
  }
  deletePosts() {
    return this.http
      .delete(
        'https://angularhttprequest-2169f-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Sent) {
            console.log('Sent');
          }
          if (event.type === HttpEventType.Response) {
            console.log('Deleted');
          }
        })
      );
  }
}
