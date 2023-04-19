import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { StorageService } from '../storage/storage.service'

@Controller('media')
export class MediaController {
  constructor(private storageService: StorageService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 10 * 1024 * 1024 // 10 MB limit
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/pdf'
        ]
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true)
        } else {
          callback(
            new UnsupportedMediaTypeException(
              "'Only .jpg, .jpeg, .png, .doc and .pdf files are allowed.'"
            ),
            false
          )
        }
      }
    })
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('mediaId') mediaId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.storageService.save(
        'media/' + mediaId + '/' + file.originalname,
        file.mimetype,
        file.buffer,
        [{ mediaId: mediaId, fileName: file.originalname }]
      )
      return res.status(200).send(result)
    } catch (error) {
      return res.status(400).send({ message: error.message })
    }
  }
  //   @Get('/:mediaId')
  //   async downloadMedia(@Param('mediaId') mediaId: string, @Res() res: Response) {
  //     let storageFile: StorageFile
  //     try {
  //       storageFile = await this.storageService.get('media/' + mediaId)
  //     } catch (e) {
  //       if (e.message.toString().includes('No such object')) {
  //         throw new NotFoundException('image not found')
  //       } else {
  //         throw new ServiceUnavailableException('internal error')
  //       }
  //     }
  //     res.setHeader('Content-Type', storageFile.contentType)
  //     res.setHeader('Cache-Control', 'max-age=60d')
  //     res.end(storageFile.buffer)
  //   }

  @Get('/:mediaId')
  async listMediaFiles(
    @Param('mediaId') mediaId: string,
    @Res() res: Response
  ) {
    const files = await this.storageService.listFiles('media/' + mediaId)
    res.json(files)
  }
}
