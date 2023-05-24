![example event parameter](https://github.com/DAT2G7/grid-server/actions/workflows/build.yml/badge.svg?event=push)
![example event parameter](https://github.com/DAT2G7/grid-server/actions/workflows/jest.yml/badge.svg?event=push)

# grid-server

This repository contains the `grid-server` code accompanying AAU cs-23-DAT-2-07's P2 report

This server is responsible for delegating registered tasks to clients, as well as serving the client code to clients.

## Setup

Clone repository

```sh
git clone https://github.com/DAT2G7/grid-server
```

Install dependencies

```sh
npm install
```

Build project

```sh
npm run build
```

Start builded project

```sh
npm run start
```

While developing, the project can be run in watch mode, automatically re-compiling after changes. This is done with the watch command:

```sh
npm run watch
```

Configuration is done with `.env` files. A `.env.example` file has been supplied.

## SRC structure

The source code is loosely structured on the MVC Pattern. The `src` folder contains the following folders:

| Folder        | Description                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `controllers` | Logic for individual endpoints. These are set up independent from routing and validation for ease of development |
| `middleware`  | Middleware functions used for validation in routing                                                              |
| `models`      | Controller models fx used for interacting with the database                                                      |
| `public`      | All files served to the client. Further split into static content and pug files used in rendering views          |
| `services`    | The underlying generic classes used in creating the database                                                     |
| `routes`      | Routing logic for the serverm independent of controllers. Sets up middleware for validation                      |
| `test`        | Setup for facilitating extended testing                                                                          |
| `types`       | Typescript types bundled into groups describing their purpose                                                    |
| `utils`       | Utility functions used throughout the project                                                                    |
