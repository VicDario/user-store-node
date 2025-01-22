import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain';

export class FileUploadMiddleware {
  static containFiles(req: Request, _res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0) {
      next(CustomError.badRequest('No files were uploaded.'));
      return;
    }

    if (!Array.isArray(req.files.file)) req.body.file = [req.files.file];
    else req.body.file = req.files.file;

    next();
  }
}
