import { Validators } from '../../../config';

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean | string,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const {
      name,
      available = false,
      price,
      description,
      user,
      category,
    } = props;
    let availableBoolean = available;

    if (!name) return ['Missing name'];
    if (!user) return ['Missing user'];
    if (!category) return ['Missing category'];
    if (!Validators.isMongoID(category)) return ['Invalid category ID'];
    if (!price) return ['Missing price'];
    if (!user) return ['Missing user'];
    if (!Validators.isMongoID(user)) return ['Invalid user ID'];

    return [
      undefined,
      new CreateProductDto(
        name,
        availableBoolean,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
