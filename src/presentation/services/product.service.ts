import { ProductModel } from '../../data';
import {
  CreateProductDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from '../../domain';
import { ProductEntity } from '../../domain/entities/product.entity';

export class ProductService {
  public async createProduct(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({
      name: createProductDto.name,
    });
    if (productExists) throw CustomError.conflict('Product already exists');

    try {
      const product = new ProductModel(createProductDto);
      await product.save();

      return ProductEntity.fromObject(product);
    } catch (error) {
      throw CustomError.internalServer('Error creating product');
    }
  }

  public async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = paginationDto.limit * (paginationDto.page - 1);
    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find().skip(skip).limit(limit).populate('user').exec(),
      ]);
      return {
        page,
        limit,
        total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        previous:
          page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        products: products.map(ProductEntity.fromObject),
      };
    } catch (error) {
      throw CustomError.internalServer('Error getting products');
    }
  }
}
