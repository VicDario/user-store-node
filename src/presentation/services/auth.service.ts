import { BcryptAdapter, JwtAdapter } from '../../config';
import { userModel } from '../../data';
import { CustomError, LoginUserDto, UserEntity } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new userModel(registerUserDto);
      user.password = BcryptAdapter.hash(user.password);
      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer('Error while creating jwt');

      return { user: userEntity, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await userModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email or password not valid');

    const isMatching = BcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching)
      throw CustomError.badRequest('Email or password not valid');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error while creating jwt');

    return { user: userEntity, token };
  }
}
