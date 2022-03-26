import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Outgoing Request');
    console.log(req.headers);
    return next.handle(req).pipe(
      tap((events) => {
        if (events.type === HttpEventType.Response) {
          console.log('Incoming Response');
        }
      })
    );
  }
}
