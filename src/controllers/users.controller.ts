import { Request, Response, Router } from "express";
import { UsersRepository } from '../repositories';
import { User } from "../models";
import { BaseController } from "./base/base.controller";


export class UsersController extends BaseController<User> {

  constructor(usersRepository: UsersRepository) {
    super(usersRepository);
  }
}