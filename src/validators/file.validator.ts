import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const imageFileFilter = (req : Request, file : Express.Multer.File, callback : any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed !'), false);
  }
  callback(null, true);
};

export const mediaFileFilter = (req : Request, file : Express.Multer.File, callback : any) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
  const videoExtensions = /\.(mp4|mov|avi|webm|mkv)$/i;
  
  if (!imageExtensions.test(file.originalname) && !videoExtensions.test(file.originalname)) {
    return callback(new Error('Only image or video files are allowed !'), false);
  }
  callback(null, true);
};

export const videoFileFilter = (req : Request, file : Express.Multer.File, callback : any) => {
  const videoExtensions = /\.(mp4|mov|avi|webm|mkv)$/i;
  
  if (!videoExtensions.test(file.originalname)) {
    return callback(new Error('Only video files are allowed !'), false);
  }
  callback(null, true);
};

export const editFileName = (req: any, file: Express.Multer.File, callback: any) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${uuid()}${fileExtName}`);
};

export async function validateVideoDuration(filePath: string, maxDurationSeconds: number = 10): Promise<boolean> {
  try {
    // Utiliser ffprobe pour obtenir la durée de la vidéo
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    
    const duration = parseFloat(stdout.trim());
    
    if (isNaN(duration)) {
      throw new Error('Could not determine video duration');
    }
    
    return duration <= maxDurationSeconds;
  } catch (error) {
    console.error('Error validating video duration:', error);
    throw new Error('Failed to validate video duration. Please ensure ffmpeg is installed.');
  }
}
