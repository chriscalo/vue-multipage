const path = require("path");
const glob = require('fast-glob');
const fse = require("fs-extra");
const { stripIndent } = require("common-tags");

const pathGlob = processRelativePath('./pages/**/*.vue');
const vuePagesPromise = glob(pathGlob);


// Step 1: create a pages.config.js
// pages: {
//   "index": 'src/pages/index.js',
//   "login/index": "src/pages/login.js",
//   "profile/index": "src/pages/profile/index.js",
//   "foo/index": 'src/pages/foo.js',
//   "bar/index": 'src/pages/bar/index.js',
// },

const pagesConfigPromise = vuePagesPromise.then(pages => {
  return pages.map(page => {
    const { dir, name } = path.parse(page);
    const entryRoot = path.relative("src/pages", dir);
    const entryNames = entryRoot.split(path.sep).concat(name === "index" ? [name] : [name, "index"]);
    entryNames.push(name);
    console.log(`${page} => ${entryNames.join(path.sep)}`);
    const entryName =
      (name === "index")
      ? `${entryRoot}/${name}`
      : `${entryRoot}/${name}/index`;
    const entryFile = path.join(dir, `${name}.js`);
    return {
      page,
      entryName,
      entryFile,
    };
  });
});

pagesConfigPromise.then(console.log);

const entryPointContent = (page) => stripIndent`
  import Vue from "vue";
  import page from "./${page}.vue"
  
  new Vue({
    render: h => h(page),
  }).$mount('#app');
`;


// Step 2: create a corresponding entry point file for each page
vuePagesPromise.then(pages => {
  return;
  pages.forEach(page => {
    const { dir, name } = path.parse(page);
    
    console.log(`Found page: ${page}`);
    console.log(`Creating entry point: ${dir}/${name}.js`);
    console.log("");
    console.log(entryPointContent(name));
    console.log("");
    console.log("");
  });
});


// TODO: save this as a package
function processRelativePath(p) {
  const pathToThisDir = path.relative(process.cwd(), __dirname);
  return path.join(pathToThisDir, p);
}
