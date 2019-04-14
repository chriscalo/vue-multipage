const { apiServer } = require('./src/api');

module.exports = {
  pages: {
    "index": 'src/pages/index.js',
    "login/index": "src/pages/login.js",
    "profile/index": "src/pages/profile/index.js",
    "foo/index": 'src/pages/foo.js',
    "bar/index": 'src/pages/bar/index.js',
  },
  devServer: {
    historyApiFallback: false,
    before: devServer => {
      devServer.use(apiServer);
    },
    writeToDisk: true,
  },
};
