/**
 * The authentication middleware. Populate the request.body 
 * with the [[ServerDefaults.authUserBodyPropertyName]] property
 * containing the token user
 */
public static AuthMiddleware = async (req: Request, 
                                      res: Response,
                                      next: Function) => {

    const token = req.headers[ServerDefaults.jwtTokenHeaderName];
    if (token) {
        const isValid = AuthenticationController.ValidateToken(token);
        // Is is valid proceed
        if (isValid) {
            req.body[ServerDefaults.authUserBodyPropertyName] = 
                                                        decode(token);
            return next();
        }
        // return auth exception
    } else {
        // return missing token
    }
}