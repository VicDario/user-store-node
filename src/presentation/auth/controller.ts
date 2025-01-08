import type { NextFunction, Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
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

  loginUser = (request: Request, res: Response) => {};

  validateEmail = (request: Request, res: Response) => {};
}
