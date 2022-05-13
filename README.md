# Nextjs http method wrapper (nextjs-http-wrapper)

[![NPM version](https://img.shields.io/npm/v/nextjs-http-wrapper.svg?style=flat)](https://npmjs.com/package/nextjs-http-wrapper)
[![NPM downloads](https://img.shields.io/npm/dm/nextjs-http-wrapper.svg?style=flat)](https://npmjs.com/package/nextjs-http-wrapper)

## About

Http method wrapper helper function for Nextjs API routes.<br>
It encapsulates Next.js api http methods with a single function. So now you don't have to check the http method within the handler. `nextjs-http-wrapper` makes sure that the `req.method` matches the http method key passed to the wrapper.
The wrapper also supports authentication.

## Installation

```sh
$ npm install --save nextjs-http-wrapper
$ yarn add  nextjs-http-wrapper
```

## Setup

First we will need to initialize our method wrapper.
You can either use initialize it with or without isAuthenticated function/Promise.

With authentication

```
import { NextApiRequest } from "next";
import { initializeHttpWrapper } from "nextjs-http-wrapper";

// This can either be a normal function or a Promise.
const isAuthenticated = (req: NextApiRequest) => {
  // Some authentication logic
  const isLoggedIn = req.user;

  return isLoggedIn;
};

export const httpMethodWrapper = initializeHttpWrapper(isAuthenticated);
```

or without authentication

```
import { initializeHttpWrapper } from "nextjs-http-wrapper";

export const httpMethodWrapper = initializeHttpWrapper();
```

## Usage

Within your Next.js application there is a api folder `/pages/api/*` where all your api handlers live.

```
import type { NextApiRequest, NextApiResponse } from "next";
import { httpMethodWrapper } from "../../lib/httpMethodWrapper";

const getHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("Get");
};

const postHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("POST");
};

const deleteHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("DELETE");
};

const putHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("PUT");
};

export default httpMethodWrapper(
  {
    GET: getHandler,
    POST: postHandler,
    DELETE: deleteHandler,
    // Inline function
    PUT: (_req, res) => {
      res.status(200).send("PUT");
    },
    // Put as many http methods as you like.
  },
  "auth" // Optional
);
```
