export const promisify = (func: Function) => (...args: any[]) =>
  new Promise((resolve, reject) =>
    func(...args, (err: Error, result: any) =>
      err ? reject(err) : resolve(result)
    )
  );
