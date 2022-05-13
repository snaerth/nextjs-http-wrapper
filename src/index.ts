import HTTPMethod from 'http-method-enum';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { promisify } from './promisify';

type ExecuteFn = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

type ApiMethods = {
  [key in HTTPMethod]?: ExecuteFn;
};

type IsAuthenticatedHandler = (
  req: NextApiRequest
) => boolean | Promise<boolean>;

export const initializeHttpWrapper = (
  isAuthenticated?: IsAuthenticatedHandler,
  logger?: (err: unknown) => void
) => {
  const isAuthenticatedAsync = isAuthenticated
    ? promisify(isAuthenticated)
    : undefined;

  const withAuth = <T>(
    apiRoute: NextApiHandler<T>,
    isAuthenticated: IsAuthenticatedHandler
  ): NextApiHandler<T> => {
    return async (req, res) => {
      let isLoggedIn = await isAuthenticated(req);

      if (isLoggedIn) {
        return apiRoute(req, res);
      }

      res.status(401).end('Unauthorized');
    };
  };

  /**
   * Http method wrapper helper function for Nextjs API routes.
   * @param apiMethods object containing http method as key and a handler function
   * @param access access restriction property.
   * @example
   *   export default httpMethodWrapper({
   *     GET: getHandler,
   *     POST: postHandler,
   *     PUT: putHandler,
   *     DELETE: deleteHandler,
   *     ...
   *   });
   */
  return (apiMethods: ApiMethods, access?: 'auth'): NextApiHandler => {
    const methodExecute = async (
      req: NextApiRequest,
      res: NextApiResponse
    ): Promise<void> => {
      for (const method of Object.keys(apiMethods)) {
        const executeFn = apiMethods[method as keyof typeof HTTPMethod];

        if (req.method === method && executeFn) {
          try {
            return await executeFn(req, res);
          } catch (err) {
            if (logger) {
              logger(err);
            } else {
              console.error(err);
            }

            return res.status(500).send(err);
          }
        }
      }

      res.status(405).end('Unsupported method');
    };

    if (!isAuthenticatedAsync) {
      return methodExecute;
    }

    switch (access) {
      case 'auth':
        return withAuth(
          methodExecute,
          isAuthenticatedAsync as IsAuthenticatedHandler
        );
      default:
        return methodExecute;
    }
  };
};
