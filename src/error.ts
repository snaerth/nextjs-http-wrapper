const isNonNullObject = (obj: unknown): obj is Record<string, unknown> =>
  typeof obj === 'object' && obj !== null;

export const isError = (error: unknown): error is Error => {
  if (error instanceof Error) {
    return true;
  }

  return isNonNullObject(error) && 'name' in error && 'message' in error;
};

export const getErrorMessage = (error: unknown) => {
  if (isNonNullObject(error) && typeof error.message === 'string') {
    return error.message;
  }

  return undefined;
};

const generateErrorMessage = (error: unknown): string | undefined => {
  const message = getErrorMessage(error);

  if (typeof message === 'string') {
    return message;
  }

  try {
    return JSON.stringify(error);
  } catch (ex) {
    return undefined;
  }
};

export const toErrorObject = (error: unknown): Error => {
  if (isError(error)) {
    return error;
  }

  return new Error(generateErrorMessage(error));
};
