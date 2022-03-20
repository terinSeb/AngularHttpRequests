import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './posts.model';
import { PostsService } from './posts.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularHttpRequest';
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;
  constructor(private http: HttpClient, private postService: PostsService) {}
  ngOnInit(): void {
    this.onFetchPosts();
    // this.postService.fetchPosts();
    this.errorSub = this.postService.errorSubject.subscribe((errorMsg) => {
      this.error = errorMsg;
      this.isFetching = false;
    });
  }
  // onCreatePost(postData: { title: string; content: string }) {
  onCreatePost(postData: Post) {
    this.postService.createAndStorePosts(postData.title, postData.content);
  }
  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
      }
    );
  }
  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  private fetchPosts() {
    this.postService.fetchPosts();
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
  onHandleError() {
    this.error = null;
  }
}
