import multer from 'multer';
import multerS3 from 'multer-s3';
// import aws from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
  region: process.env.REGION, // this is the region that you select in AWS account
});

const s3Storage = multerS3({
  s3: s3, // s3 instance 
  bucket: process.env.BUCKET, // bicket name
  acl: 'public-read', // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + '_' + file.fieldname + '_' + file.originalname;
    cb(null, fileName);
  },
});

// const s3Client = new S3Client({ region: REGION });

// aws.config.update({
//   secretAccessKey: process.env.ACCESS_SECRET,
//   accessKeyId: process.env.ACCESS_KEY,
//   region: process.env.REGION,
// });

// const BUCKET = process.env.BUCKET;
// export const s3 = new aws.S3();

export const upload = multer({
  storage: s3Storage,
});
