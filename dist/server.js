"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
require("reflect-metadata");
/**
 * Controllers (route handlers).
 */
const users_controller_1 = require("./controllers/users.controller");
const repositories_1 = require("./repositories");
const dist_1 = require("gdl-thesis-core/dist");
const inversify_1 = require("inversify");
const mongoose = require("mongoose");
// Schemas
const user_schema_1 = require("./schemas/user.schema");
const company_schema_1 = require("./schemas/company.schema");
const role_schema_1 = require("./schemas/role.schema");
const roles_repository_1 = require("./repositories/roles.repository");
const roles_controller_1 = require("./controllers/roles.controller");
const environment_1 = require("./environment");
const di_types_1 = require("./di-types");
const companies_controller_1 = require("./controllers/companies.controller");
const internships_controller_1 = require("./controllers/internships.controller");
const internship_proposals_controller_1 = require("./controllers/internship-proposals.controller");
const internship_schema_1 = require("./schemas/internship.schema");
const internship_proposal_schema_1 = require("./schemas/internship-proposal.schema");
const authentication_controller_1 = require("./controllers/authentication.controller");
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
app.use((err, req, res, next) => {
    if (req.xhr) {
        return new dist_1.ApiResponse({
            data: null,
            exception: err,
            httpCode: 500,
            response: res,
        }).send();
    }
    else {
        next(err);
    }
});
// Connect
mongoose.connect(environment_1.environment.connectionString).then(client => {
    // Initialize the IoC container
    const container = new inversify_1.Container();
    // Bind express application
    container.bind(di_types_1.types.App).toConstantValue(app);
    // Bind all mongoose models
    container.bind(di_types_1.types.Models.User).toConstantValue(user_schema_1.UserModel);
    container.bind(di_types_1.types.Models.Role).toConstantValue(role_schema_1.RoleModel);
    container.bind(di_types_1.types.Models.Company).toConstantValue(company_schema_1.CompanyModel);
    container.bind(di_types_1.types.Models.InternShip).toConstantValue(internship_schema_1.InternshipModel);
    container.bind(di_types_1.types.Models.InternShipProposal).toConstantValue(internship_proposal_schema_1.InternshipProposalModel);
    // Bind all repositories
    container.bind(repositories_1.UsersRepository).to(repositories_1.UsersRepository).inTransientScope();
    container.bind(roles_repository_1.RolesRepository).to(roles_repository_1.RolesRepository).inTransientScope();
    container.bind(repositories_1.CompaniesRepository).to(repositories_1.CompaniesRepository).inTransientScope();
    container.bind(repositories_1.InternshipsRepository).to(repositories_1.InternshipsRepository).inTransientScope();
    container.bind(repositories_1.InternshipsProposalsRepository).to(repositories_1.InternshipsProposalsRepository).inTransientScope();
    // Create the required controllers
    const usersController = container
        .resolve(users_controller_1.UsersController)
        // .useAuth()
        .attachCrud()
        .register();
    const rolesController = container
        .resolve(roles_controller_1.RolesController)
        .attachCrud()
        .register();
    const companiesController = container
        .resolve(companies_controller_1.CompaniesController)
        .attachCrud()
        .register();
    const internshipsController = container
        .resolve(internships_controller_1.InternshipsController)
        .attachCrud()
        .register();
    const internshipProposalsController = container
        .resolve(internship_proposals_controller_1.InternshipProposalsController)
        .attachCrud()
        .register();
    // Initialize Auth controller and catch all 404
    const authController = container
        .resolve(authentication_controller_1.AuthenticationController)
        .handleMissingRoutes()
        .register();
}).catch(ex => {
    console.error("Can not connect to mongoDB!");
});
/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
