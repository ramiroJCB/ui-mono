export const simpleMemoize = <ResultFn extends (newArgs: any) => ReturnType<ResultFn>>(fn: ResultFn) => {
  let lastArg: any;
  let lastResult: ReturnType<ResultFn>;

  return (arg: any) => {
    if (arg !== lastArg) {
      lastArg = arg;
      lastResult = fn(arg);
    }

    return lastResult;
  };
};
