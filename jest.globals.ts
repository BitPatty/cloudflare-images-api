const jestGlobals = {
  AUTH_KEY: process.env.AUTH_KEY as string,
  ACCOUNT_IDENTIFIER: process.env.AUTH_ACCOUNT as string,
};

export default jestGlobals;
