import { Request, Response, Router, RequestHandler } from "express";
import { BaseRepository } from '../../repositories';
import { IBaseEntity, ApiResponse } from "gdl-thesis-core/dist";
import { inject, injectable, unmanaged } from "inversify";
import { types } from "../../utils/di-types";
import { verify, sign, decode } from 'jsonwebtoken';
import { environment } from "../../environment";
import { RequestParamHandler } from "express-serve-static-core";
import { ServerDefaults } from "../../ServerDefaults";
import { adminScope } from "../../utils/auth/scopes";
import { CurdOptions } from "../../models/interfaces/crud-options.interface";

/**
 * The base controller with CRUD and authentication
 */
@injectable()
export class BaseController<T extends IBaseEntity> {

    /** The express router */
    protected router: Router = Router();

    /** Indicates if the authentication has been enabled in this controller */
    protected isAuthEnabled: boolean = false;

    /** The collection name */
    get routeName() {
        return this.baseRepository.collectionName;
    }

    /**
     * Create a new base controller and attaches CRUD method with 'routeName' express route
     * @param baseRepository The generic base repository with CRUD operations
     * @param app The express application used to register a new route for this controller
     */
    constructor(
        @unmanaged() private baseRepository: BaseRepository<T>,
        @unmanaged() private app: any) {
    }

    private useMiddleware(middleware: Array<RequestHandler>) {
        if (middleware && middleware.length) {
            this.router.use(middleware);
        }
        return this;
    }

    /**
     * Attach to the current route the CRUD operations.
     * 
     * A user scope can be specified using a scope middleware.
     * 
     * Delete operation required Admin scope by default in all callection
     */
    public useCrud(options?: CurdOptions) {
        return this
            .useMiddleware(options ? options.middleware : null)
            .useCreate(options && options.createUpdate ? options.createUpdate.middleware : null)
            .useRead(options && options.read ? options.read.middleware : null)
            .useDelete(options && options.delete ? options.delete.middleware : this.isAuthEnabled ? [adminScope] : null);
    }

    /**
     * Attach to the current route the create operation
     * 
     * A user scope can be specified using a scope middleware.
     */
    public useCreate(middleware?: Array<RequestHandler>) {
        this.useMiddleware(middleware);
        this.router.post('/', async (req, res) => {
            console.log(`POST [${this.routeName}]`);
            this.baseRepository.update(req.body)
                .then(result => {
                    return new ApiResponse({
                        data: result,
                        httpCode: 200,
                        response: res
                    }).send();
                }).catch(ex => {
                    return new ApiResponse({
                        data: null,
                        httpCode: 500,
                        response: res,
                        exception: ex
                    }).send();
                });
        });
        return this;
    }

    /**
     * Attach to the current route the read all and ready by id operation
     * 
     * A user scope can be specified using a scope middleware.
     */
    public useRead(middleware?: Array<RequestHandler>) {
        this.useMiddleware(middleware);
        this.router.get('/', (req, res) => {
            console.log(`GET [${this.routeName}/]`);
            return this.baseRepository.find()
                .then(value => {
                    return new ApiResponse({
                        data: value,
                        httpCode: 200,
                        response: res
                    }).send();
                }).catch(error => {
                    return new ApiResponse({
                        data: null,
                        httpCode: 500,
                        response: res,
                        exception: error
                    }).send();
                });
        });

        this.router.get('/:id', (req, res) => {
            console.log(`GET [${this.routeName}/${req.params.id}]`);
            this.baseRepository.get(req.params.id)
                .then(result => {
                    return new ApiResponse({
                        data: result,
                        httpCode: 200,
                        response: res
                    }).send();
                }).catch(ex => {
                    return new ApiResponse({
                        data: null,
                        httpCode: 500,
                        response: res,
                        exception: ex
                    }).send();
                });
        });
        return this;
    }

    /**
     * Attach to the current route the delete operation
     * 
     * A user scope can be specified using a scope middleware.
     */
    public useDelete(middleware?: Array<RequestHandler>) {
        this.useMiddleware(middleware);
        this.router.delete('/:id', async (req, res) => {
            console.log(`DELETE [${this.routeName}/${req.params.id}]`);
            this.baseRepository.delete(req.params.id)
                .then(result => {
                    return new ApiResponse({
                        data: result,
                        httpCode: 200,
                        response: res
                    }).send();
                }).catch(ex => {
                    return new ApiResponse({
                        data: null,
                        httpCode: 500,
                        response: res,
                        exception: ex
                    }).send();
                });
        });
        return this;
    }

    /**
     * Enable JWT token verification. Every method called after this call will use authentication
     * 
     * A user scope can be specified using a scope middleware.
     * 
     * @param use Indicate if the authentication must be used or not - default true
     */
    public useAuth(use: boolean = true) {
        this.isAuthEnabled = use;
        if (use) {
            this.router.use('*', async (req, res, next) => {
                try {
                    const token = req.headers[ServerDefaults.jwtTokenHeaderName] as string;
                    if (token) {
                        // Verify token
                        const isValid = verify(token, environment.jwtSecret);

                        // Is is valid proceed
                        if (isValid) {
                            req.body[ServerDefaults.authUserBodyPropertyName] = decode(token);
                            return next();
                        }

                        // Otherwise throw an auth error
                        return new ApiResponse({
                            response: res,
                            httpCode: 401,
                            exception: "Invalid token. Unauthorized"
                        }).send();
                    } else {
                        // Token not found, throw an auth error
                        return new ApiResponse({
                            response: res,
                            httpCode: 401,
                            exception: "Unauthorized"
                        }).send();
                    }
                } catch (ex) {
                    return new ApiResponse({
                        response: res,
                        httpCode: 500,
                        exception: ex
                    }).send();
                }
            });
        }
        return this;
    }

    /**
     * Register this controller routes to the global express application
     */
    public register() {
        this.app.use(`/${this.routeName}`, this.router);
        return this;
    }
}