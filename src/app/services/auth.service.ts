import { User, RoleType } from "../models";
import { Role } from "../models/entities/base";

export class AuthService {
    public user: User = new User({
        role: new Role({
            name: "admin",
            type: RoleType.Admin
        })
    });
}