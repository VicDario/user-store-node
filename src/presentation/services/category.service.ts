import { CategoryModel } from '../../data';
import { CreateCategoryDto, CustomError, UserEntity } from '../../domain';
import { CategoryEntity } from '../../domain/entities/category.entity';

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

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer('Error creating category');
    }
  }

  public async getCategories(): Promise<CategoryEntity[]> {
    try {
      const categories = await CategoryModel.find();
      return categories.map(CategoryEntity.fromObject);
    } catch (error) {
      throw CustomError.internalServer('Error getting categories');
    }
  }
}
