import type { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import path from 'path';
import { CustomError } from '../../domain';

export class ImageController {
  constructor() {}

  getImage = (req: Request, res: Response, next: NextFunction) => {
    const { type = '', img = '' } = req.params;
    const imagePath = path.resolve(__dirname, '../../../public/uploads', type, img);
    if (!existsSync(imagePath)) {
      next(CustomError.notFound('Image not found'));
      return;
    }

    res.sendFile(imagePath);
  };
}
