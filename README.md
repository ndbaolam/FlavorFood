# FlavorFood

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Requirements

Docker, Docker compose, Nx, NestCLI, Yarn

## Run PostgreSQL

```sh
cp .example.env .env
docker compose up -d
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

You can use `yarn nx list` to get a list of installed plugins. Then, run `yarn nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/node?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
