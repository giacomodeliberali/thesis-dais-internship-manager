# Thesis - Server
This is the server side app, author: *Giacomo De Liberali, deliberali.giacomo@gmail.com*

## Architecture
The infrastructure is divided in different abstraction levels:
- Schemas
- Repositories
- Controllers

### Schemas
Schemas are the definition of MongoDB collections, built using the ORM *mongoose*.

### Repositories
Repositories are the entities who read from and write into mongoose schema models.

## Controllers
Controllers expose repositories methods through an *ExpressJs* named route.


## Deploy 
The app is published in *Heroku* and visible [here](https://arcane-tundra-32042.herokuapp.com/).



