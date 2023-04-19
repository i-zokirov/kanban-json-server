import { DownloadResponse, Storage } from '@google-cloud/storage'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as keys from '../keys/storage.json'
import { StorageFile } from './storage.file'
@Injectable()
export class StorageService {
  private storage: Storage
  private bucket: string

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('PROJECT_ID'),
      credentials: {
        private_key: keys.private_key,
        client_email: this.configService.get<string>('CLIENT_EMAIL')
      }
    })
    this.bucket = this.configService.get<string>('STORAGE_MEDIA_BUCKET')
  }
  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[]
  ) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {})
    const file = this.storage.bucket(this.bucket).file(path)
    const stream = file.createWriteStream()

    return await new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err)
      })

      stream.on('finish', async () => {
        try {
          await file.setMetadata({
            metadata: object,
            name: file.name,
            contentType
          })
          const [publicUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2025'
          })
          resolve({ metadata: object, publicUrl })
        } catch (err) {
          reject(err)
        }
      })

      stream.end(media)
    })
  }

  async delete(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true })
  }

  async get(path: string): Promise<StorageFile> {
    try {
      const fileResponse: DownloadResponse = await this.storage
        .bucket(this.bucket)
        .file(path)
        .download()
      const [buffer] = fileResponse
      const storageFile = new StorageFile()
      storageFile.buffer = buffer
      storageFile.metadata = new Map<string, string>()
      return storageFile
    } catch (error) {
      console.log(error)
    }
  }

  async listFiles(path: string): Promise<any[]> {
    const [files] = await this.storage
      .bucket(this.bucket)
      .getFiles({ prefix: path })
    const filelist = await Promise.all(
      files.map(async (file) => {
        {
          const [publicUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2025'
          })
          return { publicUrl, filename: file.metadata.name }
        }
      })
    )
    return filelist
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [metadata] = await this.storage
      .bucket(this.bucket)
      .file(path)
      .getMetadata()
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download()
    const [buffer] = fileResponse

    const storageFile = new StorageFile()
    storageFile.buffer = buffer
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {})
    )
    storageFile.contentType = storageFile.metadata.get('contentType')
    return storageFile
  }
}
