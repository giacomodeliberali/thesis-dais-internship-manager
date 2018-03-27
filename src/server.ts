import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as path from "path";

/**
 * Controllers (route handlers).
 */
import { UsersController } from "./controllers/users.controller";
import { UsersRepository } from "./repositories";
import { Db, MongoClient, ObjectID } from "mongodb";
import { ApiResponse } from "./models/entities/api-response.model";

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

const uri = "mongodb+srv://giacomodeliberali:CHV1a0UL56oeei3X@cluster0-9gjz3.mongodb.net/test";
MongoClient.connect(uri, function (err, client) {

  const usersRepository = new UsersRepository(client.db());
  const usersController = new UsersController(usersRepository);

  app.use(`/${usersController.routeName}`, usersController.getRoutes());
});


/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});