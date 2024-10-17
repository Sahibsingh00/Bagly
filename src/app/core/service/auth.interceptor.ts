import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
private consumerKey = environment.consumer_key;
private consumerSecret = environment.consumer_secret;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${btoa(this.consumerKey + ':' + this.consumerSecret)}`
      }
    });

    return next.handle(authReq);
  }
}