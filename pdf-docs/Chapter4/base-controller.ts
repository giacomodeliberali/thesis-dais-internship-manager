/**
 * Enable JWT token verification
 */
public useAuth() {
    this.router.use('*', AuthenticationController.AuthMiddleware);
    return this;
}