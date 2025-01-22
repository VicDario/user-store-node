import type { NextFunction, Request, Response } from 'express';
import { FileUploadService } from '../services';
import { CustomError } from '../../domain';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  uploadFile = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      next(CustomError.badRequest('No files were uploaded.'));
      return;
    }

    const file = files.file as UploadedFile;

    this.fileUploadService
      .uploadSingle(file)
      .then((response) => res.status(201).json(response))
      .catch(() => next());
  };

  uploadMultipleFiles = (req: Request, res: Response, next: NextFunction) => {
    res.json('UploadMultipleFiles');
  };
}
