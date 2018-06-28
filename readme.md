# Tesi di laurea in Informatica

Università: Ca' Foscari Venezia <br>
Autore: Giacomo De Liberali <br>
Relatore: Filippo Bergamasco <br>
Anno: giugno 2018

## DAIS Internship Manager

DAIS Internship Manager è un’applicazione web realizzata con lo scopo di agevolare la creazione, la ricerca e la gestione dei tirocini del Dipartimento di Informatica, Scienze ambientali e Statistica (DAIS) sviluppata utilizzando tecnologie web-based su stack MongoDB, Express, Angular & Node.js (MEAN).
Con questa piattaforma un’azienda sarà in grado di registrarsi e pubblicare un’offerta di tirocinio che, una volta approvata da un professore, verrà pubblicata e resta disponibile agli studenti. Gli studenti a loro volta potranno candidarsi alle offerte, scegliere un docente come referente per il percorso, completare il foglio presenze e infine stampare la documentazione in PDF precompilata.

### Risorse

- [App Client](https://github.com/giacomodeliberali/thesis-dais-internship-manager/tree/master/client)
- [Package Shared](https://github.com/giacomodeliberali/thesis-dais-internship-manager/tree/master/core)
- [App Server](https://github.com/giacomodeliberali/thesis-dais-internship-manager/tree/master/server)

### Sviluppo

Per creare i bundle client e generare la documentazione e reference APIs per client, server e core lanciare il comando `gulp`. Per pubblicare una nuova versione del server su Heroku, lanciare `npm run deploy:server`.
