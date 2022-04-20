global.console.error = jest.fn();
global.console.warn = jest.fn();

process.on('unhandledRejection', err => {
  fail(err);
});
