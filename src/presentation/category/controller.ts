import type { NextFunction, Request, Response } from 'express';
import { CreateCategoryDto, CustomError } from '../../domain';

export class CategoryController {
  constructor() {}

  getCategories = (req: Request, res: Response) => {
    res.json('Get Category')
  }

  createCategory = (req: Request, res: Response, next: NextFunction) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

    if (error) next(CustomError.badRequest(error));

    res.json('Create Category')
  }
}
