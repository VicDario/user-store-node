import type { NextFunction, Request, Response } from 'express';
import { LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  registerUser = (request: Request, res: Response, next: NextFunction) => {
    const [error, registerUserDto] = RegisterUserDto.create(request.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    this.authService
      .registerUser(registerUserDto!)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  loginUser = (req: Request, res: Response, next: NextFunction) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    this.authService
      .loginUser(loginUserDto!)
      .then((response) => res.json(response))
      .catch((error) => next(error));
  };

  validateEmail = (request: Request, res: Response) => {};
}
