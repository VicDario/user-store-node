import { CustomError } from '../errors/custom.error';

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, available } = object;

    if (!_id && !id) throw CustomError.badRequest('Missing ID');

    if (!name) throw CustomError.badRequest('Missing name');
    if (available == undefined)
      throw CustomError.badRequest('Missing available');

    return new CategoryEntity(_id || id, name, available);
  }
}
