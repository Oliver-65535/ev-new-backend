import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(res => {
        switch (typeof res) {
          case 'string':
            return {
              statusCode: HttpStatus.OK,
              message: res,
            };
          case 'object':
            if (res.hasOwnProperty('message') && res.hasOwnProperty('data'))
              return {
                statusCode: HttpStatus.OK,
                message: res.message,
                data: res.data,
              };
            else
              return {
                statusCode: HttpStatus.OK,
                message: 'Success',
                data: res,
              };
          default:
            return {
              statusCode: HttpStatus.OK,
              message: 'Success',
            };
        }
      }),
    );
  }
}
