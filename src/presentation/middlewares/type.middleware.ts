import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain';

export class TypeMiddleware {
  static validType(validTypes: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      const type = req.url.split('/').at(-1) ?? '';
      if (!validTypes.includes(type)) {
        next(CustomError.badRequest('Invalid folder'));
        return;
      }
      next();
    };
  }
}
