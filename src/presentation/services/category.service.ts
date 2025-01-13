import { CategoryModel } from '../../data';
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from '../../domain';
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

      return CategoryEntity.fromObject(category);
    } catch (error) {
      throw CustomError.internalServer('Error creating category');
    }
  }

  public async getCategories(paginationDto: PaginationDto): Promise<CategoryEntity[]> {
    const skip = paginationDto.limit * (paginationDto.page - 1);
    try {
      const categories = await CategoryModel.find().skip(skip).limit(paginationDto.limit).exec();
      return categories.map(CategoryEntity.fromObject);
    } catch (error) {
      throw CustomError.internalServer('Error getting categories');
    }
  }
}
