import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { UserEntity } from '../../domain';

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid Bearer token' });
      return;
    }

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const user = await UserModel.findById(payload.id);
      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }
      if (!user.isActive) {
        res.status(401).json({ error: 'User not active' });
        return;
      }

      const userEntity = UserEntity.fromObject(user);
      req.body.user = userEntity;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
