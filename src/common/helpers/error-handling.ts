// import {
//   Logger,
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.BAD_REQUEST;

//     this.logger.error(`Status: ${status} Error: ${exception}`);

//     response.status(status).json({
//       statusCode: status,
//       message: exception,
//       // timestamp: new Date().toISOString(),
//       // path: request.url,
//     });
//   }
// }

//-------------------------------------//

// import {
//   Logger,
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.BAD_REQUEST;

//     let responseBody: any;

//     if (exception instanceof HttpException) {
//       const exceptionResponse = exception.getResponse();
//       responseBody =
//         typeof exceptionResponse === 'object' && 'response' in exceptionResponse
//           ? exceptionResponse['response']
//           : exceptionResponse;
//     } else {
//       responseBody = {
//         message: 'An unexpected error occurred',
//       };
//     }

//     this.logger.error(
//       `Status: ${status} Error: ${JSON.stringify(responseBody)}`,
//     );

//     response.status(status).json(responseBody);
//   }
// }

//----------------------//

import {
  Logger,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Statusni aniqlash
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Xabarni olish
    let message: any;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // HttpException bo'lsa, response obyektini olish
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse['message'] || exceptionResponse;
    } else if (typeof exception === 'object' && exception !== null) {
      // Agar oddiy obyekt bo'lsa
      message = JSON.stringify(exception);
    } else {
      // Obyekt bo'lmasa, stringga aylantirish
      message = String(exception);
    }

    // Log xabarini yozish
    this.logger.error(`Status: ${status}, Error: ${message}`);

    // Javobni yuborish
    response.status(status).json({
      statusCode: status,
      message: message || 'Unexpected error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
