# FlavorFood

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Requirements

Docker, Docker compose, Nx, NestCLI, Yarn

## Run PostgreSQL

```sh
cp .example.env .env
docker compose up --build -d
docker ps #To test created container
```

## Run tasks

To run the dev server, use:

```sh
yarn dev
#or
yarn run dev
```

To run the frontend, use:

```sh
yarn nx serve frontend
```

To show the frontend project
```sh
nx show project frontend
```

To build frontend
```sh
nx run frontend:build
#dist/apps/frontend
```

To create a production bundle:

```sh
nx run services:build
```

To see all available targets to run for a project, run:

```sh
yarn nx show project services
```

To run test using Jest, run: 

```sh
yarn run test
yarn run test:cov 
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## NX CLI

To generate a new application, use:

```sh
yarn nx g @nx/node:app demo
```

To generate a new library, use:

```sh
yarn nx g @nx/node:lib mylib
```

Migration
```sh
#generate
npx tsx node_modules/typeorm/cli.js migration:generate src/migrations/InitMigration -d apps/services/src/ormconfig.ts
#create manually
npx tsx node_modules/typeorm/cli.js migration:create apps/services/src/migrations/MyManualMigration
#Run migration
npx tsx node_modules/typeorm/cli.js migration:run -d apps/services/src/ormconfig.ts
```