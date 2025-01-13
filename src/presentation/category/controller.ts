import type { NextFunction, Request, Response } from 'express';
import { CreateCategoryDto, CustomError } from '../../domain';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories = (req: Request, res: Response, next: NextFunction) => {
    this.categoryService.getCategories()
      .then((categories) => res.status(200).json(categories))
      .catch((error) => next(error));
  }

  createCategory = (req: Request, res: Response, next: NextFunction) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) next(CustomError.badRequest(error));

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => next(error));
  }
}
