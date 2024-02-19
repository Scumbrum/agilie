import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const keyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.API_BASE)) {
    const withKey  = req.clone({
      params: req.params.append('api_key', environment.API_KEY)
    });

    return next(withKey);
  }

  return next(req);
};
