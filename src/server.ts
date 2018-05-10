import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as path from "path";
import "reflect-metadata";
import * as cors from 'cors';
/**
 * Controllers (route handlers).
 */
import { UsersController } from "./controllers/users.controller";
import { UsersRepository, BaseRepository, CompaniesRepository, InternshipsRepository, InternshipsProposalsRepository } from "./repositories";
import { Db, MongoClient, ObjectID } from "mongodb";
import { container } from "./utils/di-container";


import mongoose = require('mongoose');
import { Model } from "mongoose";
// Schemas
import { UserModel } from './schemas/user.schema';
import { CompanyModel } from './schemas/company.schema';
import { RoleModel } from "./schemas/role.schema";
import { RolesRepository } from "./repositories/roles.repository";
import { RolesController } from "./controllers/roles.controller";
import { environment } from "./environment";
import { types } from "./utils/di-types";
import { CompaniesController } from "./controllers/companies.controller";
import { InternshipsController } from "./controllers/internships.controller";
import { InternshipProposalsController } from "./controllers/internship-proposals.controller";
import { InternshipModel } from "./schemas/internship.schema";
import { InternshipProposalModel } from "./schemas/internship-proposal.schema";
import { AuthenticationController } from "./controllers/authentication.controller";
import { adminScope, companyScope, studentScope, professorScope, ownCompany, ownInternship } from "./utils/auth/scopes";
import { CurdOptions } from "./models/interfaces/crud-options.interface";
import { IUser, IRole, ICompany, IInternship, IInternshipProposal } from "./models/interfaces";
import { ApiResponse } from "./models/api-response.model";

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
app.use(cors());
app.options('*', cors());

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

  // Bind express application
  container.bind<Express.Application>(types.App).toConstantValue(app);

  // Bind all mongoose models
  container.bind<Model<IUser>>(types.Models.User).toConstantValue(UserModel);
  container.bind<Model<IRole>>(types.Models.Role).toConstantValue(RoleModel);
  container.bind<Model<ICompany>>(types.Models.Company).toConstantValue(CompanyModel);
  container.bind<Model<IInternship>>(types.Models.InternShip).toConstantValue(InternshipModel);
  container.bind<Model<IInternshipProposal>>(types.Models.InternShipProposal).toConstantValue(InternshipProposalModel);

  // Bind all repositories
  container.bind<UsersRepository>(UsersRepository).to(UsersRepository).inTransientScope();
  container.bind<RolesRepository>(RolesRepository).to(RolesRepository).inTransientScope();
  container.bind<CompaniesRepository>(CompaniesRepository).to(CompaniesRepository).inTransientScope();
  container.bind<InternshipsRepository>(InternshipsRepository).to(InternshipsRepository).inTransientScope();
  container.bind<InternshipsProposalsRepository>(InternshipsProposalsRepository).to(InternshipsProposalsRepository).inTransientScope();



  // Define global CRUD options
  const crudOptions: CurdOptions = {
    delete: {
      // Each delete operation require admin scope
      middleware: [adminScope]
    }
  };

  // Create the required controllers
  const usersController = container
    .resolve(UsersController)
    .useAuth()
    .useUpdateOwn()
    .useGetByRoles([adminScope])
    .useCreate()
    .useUpdate([adminScope])
    .useRead([adminScope])
    .useDelete([adminScope])
    .register();

  const rolesController = container
    .resolve(RolesController)
    .useAuth()
    .useCrud(crudOptions)
    .register();

  const companiesController = container
    .resolve(CompaniesController)
    .useAuth()
    .useGetByOwnerId()
    .useCrud({
      delete: {
        middleware: [adminScope]
      },
      update: {
        middleware: [ownCompany]
      }
    })
    .register();

  const internshipsController = container
    .resolve(InternshipsController)
    .useAuth()
    .useGetByCompanyOwnerId()
    .useGetApproved()
    .useListStates()
    .useUpdateStates()
    .useForceUpdateStates()
    .useCrud({
      delete: {
        middleware: [adminScope]
      },
      update: {
        middleware: [ownInternship]
      }
    })
    .register();

  const internshipProposalsController = container
    .resolve(InternshipProposalsController)
    .useAuth()
    .useCrud(crudOptions)
    .register();

  // Initialize Auth controller and catch all 404
  const authController = container
    .resolve(AuthenticationController)
    .register()
    .handleMissingRoutes();

  console.log("All controllers resolved!");

}).catch(ex => {
  console.error("Application exception", ex);
});


/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});
