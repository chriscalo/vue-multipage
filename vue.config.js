const { apiServer } = require("./src/api");
const pagesConfig = require("./src/entry/pages.config.js");

module.exports = {
  pages: pagesConfig,
  devServer: {
    historyApiFallback: false,
    before: devServer => {
      devServer.use(apiServer);
    },
    writeToDisk: true,
  },
};
