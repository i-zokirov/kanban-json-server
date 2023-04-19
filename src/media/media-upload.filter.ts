import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common'
import { MulterError } from 'multer'

@Catch(MulterError)
export class FileUploadExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const status = HttpStatus.BAD_REQUEST
    const message = `File upload error: ${exception.message}`

    response.status(status).json({
      statusCode: status,
      message: message
    })
  }
}
