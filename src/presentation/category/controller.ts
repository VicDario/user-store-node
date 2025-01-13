import type { NextFunction, Request, Response } from 'express';
import { CreateCategoryDto, CustomError, PaginationDto } from '../../domain';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories = (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error){
      next(CustomError.badRequest(error));
      return;
    }

    this.categoryService.getCategories(paginationDto!)
      .then((categories) => res.status(200).json(categories))
      .catch((error) => next(error));
  }

  createCategory = (req: Request, res: Response, next: NextFunction) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) {
      next(CustomError.badRequest(error));
      return;
    }

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => next(error));
  }
}
