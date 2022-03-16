import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

type UploadResponse = {
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
};

@Injectable()
export class FileService {
  constructor() {}

  async upload(file: Express.Multer.File) {
    const { originalname } = file;
    const bucketS3 = process.env.AWS_BUCKET_NAME ?? '';
    const uploadedFile: UploadResponse = await this.uploadS3(
      file.buffer,
      bucketS3,
      originalname,
    );
    return { url: uploadedFile.Location };
  }

  async uploadS3(file: any, bucket: string, name: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise<UploadResponse>((resolve, reject) => {
      s3.upload(params, (err: any, data: UploadResponse) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    const s3 = new S3();
    s3.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
      region: process.env.AWS_BUCKET_NAME,
    });
    return s3;
  }
}
