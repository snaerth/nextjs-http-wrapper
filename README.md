# Nextjs http method wrapper (nextjs-http-wrapper)

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/nextjs-http-wrapper.svg?style=for-the-badge)](https://www.npmjs.com/package/nextjs-http-wrapper)
[![npm](https://img.shields.io/npm/dt/nextjs-http-wrapper.svg?style=for-the-badge)](https://www.npmjs.com/package/nextjs-http-wrapper)
[![npm](https://img.shields.io/npm/l/nextjs-http-wrapper?style=for-the-badge)](https://github.com/nextjs-http-wrapper/nextjs-http-wrapper/blob/master/LICENSE)

</div>

## About

Next.js HTTP wrapper is a wrapper helper for Nextjs API routes.<br>
It encapsulates Next.js api routes with a single function and it supports authentication. It helps developers to be consistent, explicit, and not repeat them selfs. Let's look at some examples because the code explains better than words.

### Features

- Built for consistency, less boilerplate and do not repeat your self.
- Supports Typescript.
- Supports authentication handler.
- Supports error handling and a custom error handler if needed.
- Supports all supported HTTP methods and requires developer to be explicit about it.
- Throws 404 Method not allowed error if none supported HTTP method is called.

### Installation

```sh
$ npm install --save nextjs-http-wrapper
$ yarn add nextjs-http-wrapper
```

### Setup

First, we will need to initialize our HTTP wrapper.
You can initialize it with or without options.

Initialize setup without options.

```ts
import { initializeHttpWrapper } from 'nextjs-http-wrapper';

export const httpMethodWrapper = initializeHttpWrapper();
```

Initialize setup with options.

```ts
import { NextApiRequest } from 'next';
import { initializeHttpWrapper } from 'nextjs-http-wrapper';

// This can either be a normal function or a Promise.
const authHandler = (req: NextApiRequest) => {
  // Some authentication logic
  const isLoggedIn = req.user;

  return isLoggedIn;
};

const errorHandler = (error: Error) => {
  // Send error to services like Sentry, LogRocket, etc.
  console.log(error);
};

export const httpMethodWrapper = initializeHttpWrapper({
  authHandler,
  errorHandler,
});
```

### Usage

Within your Next.js api handler, i.e. `/pages/api/hello-world.ts`.

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { httpMethodWrapper } from '../../lib/httpMethodWrapper';

const getHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send('Get');
};

const postHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send('POST');
};

const deleteHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send('DELETE');
};

const putHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send('PUT');
};

export default httpMethodWrapper(
  {
    GET: getHandler,
    POST: postHandler,
    DELETE: deleteHandler,
    // Inline function
    PUT: (_req, res) => res.status(200).send('PUT')
    // Other supported http methods.
  },
  // If the initializeHttpWrapper is initialized with authHandler property,
  // then  authentication is on by default. To turn authentication off
  // for special hander you can provide the following object.
  {
    disableAuth: true
  }
);
```
