import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as path from "path";
import "reflect-metadata";

/**
 * Controllers (route handlers).
 */
import { UsersController } from "./controllers/users.controller";
import { UsersRepository } from "./repositories";
import { Db, MongoClient, ObjectID } from "mongodb";
import { ApiResponse, User, Role } from "gdl-thesis-core/dist";
import { Container } from "inversify";
import { IUsersRepository } from "./repositories/base/users.repository.interface";


import mongoose = require('mongoose');
// Schemas
import { UserModel } from './schemas/user.schema';
import { RoleModel } from "./schemas/role.schema";
import { IRolesRepository } from "./repositories/base/roles.repository.interface";
import { RolesRepository } from "./repositories/roles.repository";
import { RolesController } from "./controllers/roles.controller";

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use((err: any, req: express.Request, res: express.Response, next: Function) => {
  if (req.xhr) {
    return new ApiResponse({
      data: null,
      exception: err,
      httpCode: 500,
      response: res,
    }).send();
  } else {
    next(err);
  }
});

// const uri = "mongodb+srv://giacomodeliberali:CHV1a0UL56oeei3X@cluster0-9gjz3.mongodb.net/test";

/** The mongoose connection URL */
const uri = "mongodb://giacomodeliberali:CHV1a0UL56oeei3X@cluster0-shard-00-00-9gjz3.mongodb.net:27017,cluster0-shard-00-01-9gjz3.mongodb.net:27017,cluster0-shard-00-02-9gjz3.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

// Connect
mongoose.connect(uri).then(client => {
  // Initialize the IoC container
  const container = new Container();

  // Binf the application instance
  container.bind<Express.Application>("App").toConstantValue(app);

  // Bind the database instance
  container.bind<Db>(Db).toConstantValue(client.connection.db);

  // Bind all mongoose models
  container.bind<mongoose.Model<User>>(UserModel).toConstantValue(UserModel);
  container.bind<mongoose.Model<Role>>(RoleModel).toConstantValue(RoleModel);

  // Bind all repositories
  container.bind<IUsersRepository>(IUsersRepository).to(UsersRepository);
  container.bind<IRolesRepository>(IRolesRepository).to(RolesRepository);

  // Create the required controllers
  const usersController = new UsersController(container.get(IUsersRepository), app);
  const rolesController = new RolesController(container.get(IRolesRepository), app);


  // app.use(`/${rolesController.routeName}`, rolesController.getRoutes());
});


/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});