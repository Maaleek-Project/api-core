import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2Service {
    private s3: S3Client;
  private bucketName = process.env.R2_BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        },
    });
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType: string , folder : string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${folder}/${key}`,
      Body: body,
      ContentType: contentType,
    });
    await this.s3.send(command);
    return `${process.env.R2_PUBLIC_DOMAIN}/${folder}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }
}