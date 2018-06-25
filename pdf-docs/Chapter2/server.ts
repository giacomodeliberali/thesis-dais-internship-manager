// Bind all repositories in DI container
container.bind<UsersRepository>(UsersRepository)
    .to(UsersRepository).inTransientScope();

container.bind<InternshipsRepository>(InternshipsRepository)
    .to(InternshipsRepository).inTransientScope();

// Bind all repositories...

// And then resolve and register controllers
const internshipsController = container
    .resolve(InternshipsController)     // resolve dependencies
    .useAuth()                          // use auth middleware
    .useCustoms()                       // use custom methods
    .useCrud({                          // use CRUD operation
        delete: {
            middleware: [adminScope]    // optional middleware
        },
        update: {
            middleware: [ownInternship] // optional middleware
        }
    })
    .register();                        // register routes

// Resolve all controllers...