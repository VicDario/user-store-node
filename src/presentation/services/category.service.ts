import { CategoryModel } from '../../data';
import {
  CategoryEntity,
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from '../../domain';

export class CategoryService {
  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) {
    const categoryExists = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExists) throw CustomError.conflict('Category already exists');

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();

      return CategoryEntity.fromObject(category);
    } catch (error) {
      throw CustomError.internalServer('Error creating category');
    }
  }

  public async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = paginationDto.limit * (paginationDto.page - 1);
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find().skip(skip).limit(limit).exec(),
      ]);
      return {
        page,
        limit,
        total,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        previous: (page - 1) > 0 ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
        categories: categories.map(CategoryEntity.fromObject),
      };
    } catch (error) {
      throw CustomError.internalServer('Error getting categories');
    }
  }
}
