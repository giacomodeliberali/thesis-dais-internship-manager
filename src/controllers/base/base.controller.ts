import { Request, Response, Router } from "express";
import { BaseRepository } from '../../repositories';
import { IBaseEntity, ApiResponse } from "gdl-thesis-core/dist";
import { inject, injectable, unmanaged } from "inversify";
import { types } from "../../di-types";
import { verify, sign } from 'jsonwebtoken';
import { environment } from "../../environment";

/**
 * GET /
 * Home page.
 */
@injectable()
export class BaseController<T extends IBaseEntity> {

    /** The express router */
    private router: Router = Router();

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
        @unmanaged() protected baseRepository: BaseRepository<T>,
        @unmanaged() private app: any) {
    }

    /**
     * Attach to the current route the CRUD operations
     */
    public attachCrud() {
        return this
            .useCreate()
            .useRead()
            .useDelete();
    }

    /**
     * Attach to the current route the create operation
     */
    public useCreate() {
        this.router.post('/', async (req, res) => {
            console.log(`POST [${this.routeName}]`, req.body);
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
     */
    public useRead() {
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
     */
    public useDelete() {
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
     */
    public useAuth() {
        this.router.all('*', async (req, res, next) => {
            try {
                const token = req.headers['token'] as string;
                if (token) {
                    // Verify token
                    const isValid = verify(token, environment.jwtSecret);

                    // Is is valid proceed
                    if (isValid)
                        return next();

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