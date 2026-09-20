import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { Role } from '@prisma/client';

export const usersController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.query;
      const where: any = {};
      if (role) {
        where.role = role as Role;
      }
      const users = await prisma.user.findMany({ where });
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
};
