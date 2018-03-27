import { Request, Response, Router } from "express";
import { BaseRepository } from '../../repositories';
import { User, BaseEntity, ApiResponse } from "gdl-thesis-core/dist";

/**
 * GET /
 * Home page.
 */
export class BaseController<T extends BaseEntity<T>> {

    /** The express router */
    private router: Router = Router();

    /** The collection name */
    get routeName() {
        return this.baseService.collectionName;
    }

    /**
     * Creates a new base controller
     * @param baseService The generic base service
     */
    constructor(protected baseService: BaseRepository<T>) {
        this.attachApi();
    }

    /**
     * Attaches to the current route the CRUD operations
     */
    private attachApi() {
        this.router.get('/', (req, res) => {
            console.log(`GET [${this.routeName}/]`);
            return this.baseService.find().then(value => {
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
                const result = await this.baseService.get(req.params.id);

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
            return this.baseService.delete(req.params.id).then(value => {
                res.status(200).send(value);
            }).catch(error => {
                res.status(500).send(error);
            });
        });

        this.router.post('/', (req, res) => {
            console.log(`POST [${this.routeName}]`, req.body);

            return this.baseService.update(req.body).then(value => {
                res.status(200).send(value);
            }).catch(error => {
                res.status(500).send(error);
            });
        });
    }

    /**
     * Return the routes defined by this controller
     */
    getRoutes() {
        return this.router;
    }
}