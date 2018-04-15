import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as path from "path";
import "reflect-metadata";

/**
 * Controllers (route handlers).
 */
import { UsersController } from "./controllers/users.controller";
import { UsersRepository, BaseRepository, CompaniesRepository, InternshipsRepository, InternshipsProposalsRepository } from "./repositories";
import { Db, MongoClient, ObjectID } from "mongodb";
import { ApiResponse, User, Role, Company, Internship, InternshipProposal } from "gdl-thesis-core/dist";
import { Container } from "inversify";


import mongoose = require('mongoose');
import { Model } from "mongoose";
// Schemas
import { UserModel } from './schemas/user.schema';
import { CompanyModel } from './schemas/company.schema';
import { RoleModel } from "./schemas/role.schema";
import { RolesRepository } from "./repositories/roles.repository";
import { RolesController } from "./controllers/roles.controller";
import { environment } from "./environment";
import { types } from "./di-types";
import { CompaniesController } from "./controllers/companies.controller";
import { InternshipsController } from "./controllers/internships.controller";
import { InternshipProposalsController } from "./controllers/internship-proposals.controller";
import { InternshipModel } from "./schemas/internship.schema";
import { InternshipProposalModel } from "./schemas/internship-proposal.schema";

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);

// Add body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Format JSON output
app.set('json spaces', 2);

// Add error handling middleware
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

// Connect
mongoose.connect(environment.connectionString).then(client => {
  // Initialize the IoC container
  const container = new Container();

  // Bind express application
  container.bind<Express.Application>(types.App).toConstantValue(app);

  // Bind all mongoose models
  container.bind<Model<User>>(types.Models.User).toConstantValue(UserModel);
  container.bind<Model<Role>>(types.Models.Role).toConstantValue(RoleModel);
  container.bind<Model<Company>>(types.Models.Company).toConstantValue(CompanyModel);
  container.bind<Model<Internship>>(types.Models.InternShip).toConstantValue(InternshipModel);
  container.bind<Model<InternshipProposal>>(types.Models.InternShipProposal).toConstantValue(InternshipProposalModel);

  // Bind all repositories
  container.bind<UsersRepository>(UsersRepository).to(UsersRepository).inTransientScope();
  container.bind<RolesRepository>(RolesRepository).to(RolesRepository).inTransientScope();
  container.bind<CompaniesRepository>(CompaniesRepository).to(CompaniesRepository).inTransientScope();
  container.bind<InternshipsRepository>(InternshipsRepository).to(InternshipsRepository).inTransientScope();
  container.bind<InternshipsProposalsRepository>(InternshipsProposalsRepository).to(InternshipsProposalsRepository).inTransientScope();

  // Create the required controllers
  const usersController = container.resolve(UsersController).attachCrud().register();
  const rolesController = container.resolve(RolesController).attachCrud().register();
  const companiesController = container.resolve(CompaniesController).attachCrud().register();
  const internshipsController = container.resolve(InternshipsController).attachCrud().register();
  const internshipProposalsController = container.resolve(InternshipProposalsController).attachCrud().register();


  // Add 404 handler
  app.all('*', (req, res) => {
    return new ApiResponse({
      data: null,
      exception: new Error("Route not found") as any,
      httpCode: 404,
      response: res,
    }).send();
  });

});


/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});