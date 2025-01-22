import type { NextFunction, Request, Response } from 'express';
import { FileUploadService } from '../services';
import { CustomError } from '../../domain';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  uploadFile = (req: Request, res: Response, next: NextFunction) => {
    const type = req.params.type;
    const validTypes = ['users', 'products', 'categories'];
    if (!validTypes.includes(type)) {
      next(CustomError.badRequest('Invalid folder'));
      return
    }

    const file = req.body.file.at(0) as UploadedFile;
    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then((response) => res.status(201).json(response))
      .catch((error) => next(error));
  };

  uploadMultipleFiles = (req: Request, res: Response, next: NextFunction) => {
    res.json('UploadMultipleFiles');
  };
}
