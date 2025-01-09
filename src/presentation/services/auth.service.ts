import { BcryptAdapter, envs, JwtAdapter } from '../../config';
import { userModel } from '../../data';
import {
  CustomError,
  LoginUserDto,
  UserEntity,
  RegisterUserDto,
} from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await userModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new userModel(registerUserDto);
      user.password = BcryptAdapter.hash(user.password);
      await user.save();

      await this.sendEmailValidatorLink(user.email);

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

  private async sendEmailValidatorLink(email: string) {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email`;

    const html = `
    <h1>Validate your email</h1>
    <p>Click on the following link to vlaidate your email</p>
    <a href="${link}">Validate your email</a>`;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error getting token');

    return true;
  }
}
