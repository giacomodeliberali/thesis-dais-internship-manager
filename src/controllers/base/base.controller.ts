import { Request, Response, Router } from "express";
import { BaseRepository } from '../../repositories';
import { IBaseEntity, ApiResponse } from "gdl-thesis-core/dist";
import { inject, injectable, unmanaged } from "inversify";
import { types } from "../../di-types";

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
     * Attaches to the current route the CRUD operations
     */
    public attachCrud() {
        this.router.get('/', (req, res) => {
            console.log(`GET [${this.routeName}/]`);
            return this.baseRepository.find().then(value => {
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

        this.router.get('/:id', async (req, res) => {
            console.log(`GET [${this.routeName}/${req.params.id}]`);

            try {
                const result = await this.baseRepository.get(req.params.id);

                return new ApiResponse({
                    data: result,
                    httpCode: 200,
                    response: res
                }).send();

            } catch (error) {
                console.log("===>", error);
                return new ApiResponse({
                    data: null,
                    httpCode: 500,
                    response: res,
                    exception: error
                }).send();
            }
        });

        this.router.delete('/:id', (req, res) => {
            console.log(`DELETE [${this.routeName}/${req.params.id}]`);
            return this.baseRepository.delete(req.params.id).then(value => {
                res.status(200).send(value);
            }).catch(error => {
                res.status(500).send(error);
            });
        });

        this.router.post('/', (req, res) => {
            console.log(`POST [${this.routeName}]`, req.body);

            return this.baseRepository.update(req.body).then(value => {
                res.status(200).send(value);
            }).catch(error => {
                res.status(500).send(error);
            });
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