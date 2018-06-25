import { Request, Response, Router, RequestHandler } from "express";
import { BaseRepository } from '../../repositories';
import { inject, injectable, unmanaged } from "inversify";
import { types } from "../../utils/di-types";
import { verify, sign, decode } from 'jsonwebtoken';
import { environment } from "../../environment";
import { RequestParamHandler } from "express-serve-static-core";
import { ServerDefaults } from "../../ServerDefaults";
import { adminScope } from "../../utils/auth/scopes";
import { CurdOptions } from "../../models/interfaces/crud-options.interface";
import { IBaseEntity } from "../../models/interfaces";
import { ApiResponse } from "../../models/api-response.model";
import { AuthenticationController } from "../authentication.controller";

/**
 * The base controller with CRUD and authentication
 */
@injectable()
export abstract class BaseController<T extends IBaseEntity> {

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


    /**
     * Allow to use middleware for all methods
     * @param middleware The middleware to use for all methods
     */
    public useMiddleware(...middleware: Array<RequestHandler>) {
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
     * Delete operation required Admin scope by default in all collection
     */
    public useCrud(options?: CurdOptions) {
        return this
            .useCreate(options && options.create ? options.create.middleware : null)
            .useUpdate(options && options.update ? options.update.middleware : null)
            .useRead(options && options.read ? options.read.middleware : null)
            .useDelete(options && options.delete ? options.delete.middleware : null);
    }

    /**
     * Attach to the current route the create operation
     * 
     * A user scope can be specified using a scope middleware.
     */
    public useCreate(middleware?: Array<RequestHandler>) {
        this.router.post('/', middleware || [], async (req: Request, res: Response) => {
            this.baseRepository.create(req.body)
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
     * Attach to the current route the update operation
     * 
     * A user scope can be specified using a scope middleware.
     */
    public useUpdate(middleware?: Array<RequestHandler>) {
        this.router.put('/', middleware || [], async (req: Request, res: Response) => {
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
        this.router.get('/', middleware || [], async (req: Request, res: Response) => {
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

        this.router.get('/:id', middleware || [], async (req: Request, res: Response) => {
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
        this.router.delete('/:id', middleware || [], async (req: Request, res: Response) => {
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
     */
    public useAuth() {
        this.isAuthEnabled = true;
        this.router.use('*', AuthenticationController.AuthMiddleware);
        return this;
    }

    /**
     * Register this controller routes to the global express application
     */
    public register() {
        this.app.use(`${ServerDefaults.apiBaseUrl}/${this.routeName}`, this.router);
        return this;
    }


    /**
     * Implement this method to register all custom controller routes
     */
    public abstract useCustoms(): BaseController<T>;
}