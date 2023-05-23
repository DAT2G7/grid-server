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
