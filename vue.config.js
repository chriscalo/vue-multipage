const pagesConfig = require("./src/entry/pages.config.js");
const { apiServer } = require("./src/api");
const notFoundHandler = require("./src/api/404.js");

module.exports = {
  pages: pagesConfig,
  devServer: {
    historyApiFallback: false,
    writeToDisk: true,
    before: devServer => {
      devServer.use(apiServer);
    },
    after: devServer => {
      // if devServer hasn't responded to the request, we can assume no matches
      devServer.use(notFoundHandler);
    },
  },
};
