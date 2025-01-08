import { CustomError } from '../errors/custom.error';

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public roles: string[],
    public image?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, roles, image } =
      object;

    if (!_id && !id) throw CustomError.badRequest('Missing ID');

    if (!name) throw CustomError.badRequest('Missing name');
    if (!email) throw CustomError.badRequest('Missing email');
    if (emailValidated == undefined)
      throw CustomError.badRequest('Missing emailValidated');
    if (!password) throw CustomError.badRequest('Missing password');
    if (!roles) throw CustomError.badRequest('Missing roles');

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      roles,
      image
    );
  }
}
