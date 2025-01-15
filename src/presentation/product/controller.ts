import type { NextFunction, Request, Response } from 'express';
import { CreateProductDto, CustomError, PaginationDto } from '../../domain';
import { ProductService } from '../services/product.service';

export class ProductController {
  constructor(private productService: ProductService) {}

  getProducts = (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) {
      next(CustomError.badRequest(error));
      return;
    }

    this.productService
      .getProducts(paginationDto!)
      .then((products) => res.status(200).json(products))
      .catch((error) => next(error));
  };

  createProduct = (req: Request, res: Response, next: NextFunction) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) {
      next(CustomError.badRequest(error));
      return;
    }

    this.productService
      .createProduct(createProductDto!)
      .then((product) => res.status(201).json(product))
      .catch((error) => next(error));
  };
}
