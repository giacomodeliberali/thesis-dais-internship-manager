"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
require("reflect-metadata");
const cors = require("cors");
/**
 * Controllers (route handlers).
 */
const users_controller_1 = require("./controllers/users.controller");
const repositories_1 = require("./repositories");
const di_container_1 = require("./utils/di-container");
const mongoose = require("mongoose");
// Schemas
const user_schema_1 = require("./schemas/user.schema");
const company_schema_1 = require("./schemas/company.schema");
const role_schema_1 = require("./schemas/role.schema");
const roles_repository_1 = require("./repositories/roles.repository");
const roles_controller_1 = require("./controllers/roles.controller");
const environment_1 = require("./environment");
const di_types_1 = require("./utils/di-types");
const companies_controller_1 = require("./controllers/companies.controller");
const internships_controller_1 = require("./controllers/internships.controller");
const internship_proposals_controller_1 = require("./controllers/internship-proposals.controller");
const internship_schema_1 = require("./schemas/internship.schema");
const internship_proposal_schema_1 = require("./schemas/internship-proposal.schema");
const authentication_controller_1 = require("./controllers/authentication.controller");
const scopes_1 = require("./utils/auth/scopes");
const api_response_model_1 = require("./models/api-response.model");
const emails_controller_1 = require("./controllers/emails.controller");
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
app.use((err, req, res, next) => {
    if (req.xhr) {
        return new api_response_model_1.ApiResponse({
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
    // Bind express application
    di_container_1.container.bind(di_types_1.types.App).toConstantValue(app);
    // Bind all mongoose models
    di_container_1.container.bind(di_types_1.types.Models.User).toConstantValue(user_schema_1.UserModel);
    di_container_1.container.bind(di_types_1.types.Models.Role).toConstantValue(role_schema_1.RoleModel);
    di_container_1.container.bind(di_types_1.types.Models.Company).toConstantValue(company_schema_1.CompanyModel);
    di_container_1.container.bind(di_types_1.types.Models.InternShip).toConstantValue(internship_schema_1.InternshipModel);
    di_container_1.container.bind(di_types_1.types.Models.InternShipProposal).toConstantValue(internship_proposal_schema_1.InternshipProposalModel);
    // Bind all repositories
    di_container_1.container.bind(repositories_1.UsersRepository).to(repositories_1.UsersRepository).inTransientScope();
    di_container_1.container.bind(roles_repository_1.RolesRepository).to(roles_repository_1.RolesRepository).inTransientScope();
    di_container_1.container.bind(repositories_1.CompaniesRepository).to(repositories_1.CompaniesRepository).inTransientScope();
    di_container_1.container.bind(repositories_1.InternshipsRepository).to(repositories_1.InternshipsRepository).inTransientScope();
    di_container_1.container.bind(repositories_1.InternshipsProposalsRepository).to(repositories_1.InternshipsProposalsRepository).inTransientScope();
    // Define global CRUD options
    const crudOptions = {
        delete: {
            // Each delete operation require admin scope
            middleware: [scopes_1.adminScope]
        }
    };
    // Create the required controllers
    const usersController = di_container_1.container
        .resolve(users_controller_1.UsersController)
        .useAuth()
        .useCustoms()
        .useCreate()
        .useUpdate([scopes_1.adminScope])
        .useRead([scopes_1.adminScope])
        .useDelete([scopes_1.adminScope])
        .register();
    const rolesController = di_container_1.container
        .resolve(roles_controller_1.RolesController)
        .useAuth()
        .useCustoms()
        .useCrud(crudOptions)
        .register();
    const companiesController = di_container_1.container
        .resolve(companies_controller_1.CompaniesController)
        .useAuth()
        .useCustoms()
        .useCrud({
        delete: {
            middleware: [scopes_1.adminScope]
        },
        update: {
            middleware: [scopes_1.ownCompany]
        }
    })
        .register();
    const internshipsController = di_container_1.container
        .resolve(internships_controller_1.InternshipsController)
        .useAuth()
        .useCustoms()
        .useCrud({
        delete: {
            middleware: [scopes_1.ownInternship]
        },
        update: {
            middleware: [scopes_1.ownInternship]
        }
    })
        .register();
    const internshipProposalsController = di_container_1.container
        .resolve(internship_proposals_controller_1.InternshipProposalsController)
        .useAuth()
        .useCustoms()
        .useCrud(crudOptions)
        .register();
    const emailsController = di_container_1.container
        .resolve(emails_controller_1.EmailsController)
        .register();
    // Initialize Auth controller and catch all 404
    const authController = di_container_1.container
        .resolve(authentication_controller_1.AuthenticationController)
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
//# sourceMappingURL=server.js.map