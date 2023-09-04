import { Request } from 'express';

export interface IUser {
  id: number;
  email: string;
  username?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ICreateSession {
  request: Request;
  user: IUser;
  sessionId?: string;
}
