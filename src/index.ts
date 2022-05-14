import HTTPMethod from 'http-method-enum';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { toErrorObject } from './error';

type ExecuteFn = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

type ApiMethods = {
  [key in HTTPMethod]?: ExecuteFn;
};

type AuthHandler = (req: NextApiRequest) => boolean | Promise<boolean>;

type InitializeOptions = {
  authHandler?: AuthHandler;
  errorHandler?: (err: Error) => void;
};

type WrapperOptions =
  | {
      disaableAuth: boolean;
    }
  | undefined;

export const initializeHttpWrapper = ({
  authHandler,
  errorHandler,
}: InitializeOptions) => {
  const withAuth = <T>(
    apiRoute: NextApiHandler<T>,
    authHandlerFn: AuthHandler
  ): NextApiHandler<T> => {
    return async (req, res) => {
      const isLoggedIn = await authHandlerFn(req);

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
  return (apiMethods: ApiMethods, options: WrapperOptions): NextApiHandler => {
    const { disaableAuth } = options || {};

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
            const error = toErrorObject(err);

            if (errorHandler) {
              errorHandler(toErrorObject(error));
            }

            return res.status(500).send(error);
          }
        }
      }

      res.status(405).end('Unsupported method');
    };

    if (disaableAuth) {
      return methodExecute;
    } else if (authHandler) {
      return withAuth(methodExecute, authHandler);
    } else {
      return methodExecute;
    }
  };
};
