import { v4 as uuid } from 'uuid';
import { extname } from 'path';

export const imageFileFilter = (req : Request, file : Express.Multer.File, callback : any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed !'), false);
  }
  callback(null, true);
};



export const editFileName = (req: any, file: Express.Multer.File, callback: any) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${uuid()}${fileExtName}`);
};
