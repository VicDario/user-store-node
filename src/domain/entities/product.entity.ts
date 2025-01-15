import { CustomError } from '../errors/custom.error';

export class ProductEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public price: number,
    public description: string,
    public user: string,
    public category: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, available, price, description, user, category } =
      object;

    if (!_id && !id) throw CustomError.badRequest('Missing ID');

    if (!name) throw CustomError.badRequest('Missing name');
    if (available == undefined)
      throw CustomError.badRequest('Missing available');

    return new ProductEntity(
      _id || id,
      name,
      available,
      price,
      description,
      user,
      category
    );
  }
}
