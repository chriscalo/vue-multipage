const path = require("path");
const glob = require('fast-glob');
const fse = require("fs-extra");
const R = require("ramda");
const { stripIndent } = require("common-tags");

const pathGlob = processRelativePath('../src/pages/**/*.vue');
const vuePagesPromise = glob(pathGlob);

// Step 1: compute specifications for work to be done
const pagesConfigPromise = vuePagesPromise.then(pages => {
  return pages.map(page => {
    const { dir, name } = path.parse(page);
    const entryRoot = path.relative("src/pages", dir);
    const entryName = (
      split(entryRoot, path.sep)
    ).concat(
      ensureEndsWith([name], "index")
    ).join(path.sep);
    const entryFilePath = path.join(
      processRelativePath("../src/entry"), `${entryName}.js`
    );
    const importPath = path.relative("src", page);
    const entryFileContent = entryPointContent(importPath);
    
    return {
      source: page,
      entryName,
      entryFilePath,
      entryFileContent,
    };
  });
});

// Step 2: clear entry folder
const entryFolderPath = processRelativePath("../src/entry");
console.log(entryFolderPath);
// fse.removeSync(entryFolderPath);

// Step 2: create a corresponding entry point file for each page
pagesConfigPromise.then(config => {
  config.forEach(page => {
    fse.outputFile(page.entryFilePath, page.entryFileContent);
  });
});



// Step 3: create a pages.config.js
// module.exports = {
//   "index": 'src/pages/index.js',
//   "login/index": "src/pages/login.js",
//   "profile/index": "src/pages/profile/index.js",
//   "foo/index": 'src/pages/foo.js',
//   "bar/index": 'src/pages/bar/index.js',
// };
const pagesConfigPath = processRelativePath("../src/entry/pages.config.js");
pagesConfigPromise
  .then(config => {
    // transforms each into something like:
    // { "login/index": "src/pages/login.js" }
    return config.map(page => ({
      [page.entryName]: page.entryFilePath,
    }));
  })
  .then(R.mergeAll)
  .then(pageConfigContent)
  .then(content => fse.outputFileSync(pagesConfigPath, content))
  .then(() => console.log(`Pages config file written: ${pagesConfigPath}`));


function pageConfigContent(config) {
  return stripIndent`
    module.exports = ${JSON.stringify(config, null, 2)};
  `;
}


// TODO: save this as a package
function processRelativePath(p) {
  const pathToThisDir = path.relative(process.cwd(), __dirname);
  return path.join(pathToThisDir, p);
}

// fixes split() behavior for empty string ("")
function split(string, separator) {
  if (string.length === 0) {
    return [];
  } else {
    return string.split(separator);
  }
}

function ensureEndsWith(array, item) {
  if (array.slice(-1)[0] === item) {
    return array;
  } else {
    return array.concat([item]);
  }
}

function entryPointContent(importPath) {
  return stripIndent`
    import Vue from "vue";
    import page from "@/${importPath}";
    
    new Vue({
      render: h => h(page),
    }).$mount('#app');
  `;
}
