# vue-multipage

Example repo showing how to get Vue dev server working in multpage mode with a
custom Express API server.

This project combines the following:
- Vue project created from the Vue CLI (no need to eject)
- single-file components (SFCs, aka `.vue` files)
- multi-page mode where each `.vue` file in `src/pages` is built as a Vue app
- auto-generation of entry point `.js` files (because `.vue` files can't be
  webpack entry points 🙄)
- just regular `<a href="…">` links, no need for `vue-router` (unfortunately,
  there's a brief flicker of white during page transitions)
- dev server with hot module reloading (HMR)
- API server with example auth logic that gets merged with dev server


## Setup: The Easy Way™️

Clone this repo and start making changes to it.

Run the local dev server:

``` sh
yarn # install dependencies
yarn run dev # run dev server
```


## Setup: The Long Way™️

To better understand how this setup was pieced together.

### Create a new project

Use the Vue CLI to create a new project.

``` sh
vue create vue-multipage-test
```

To keep things simple, I selected only Babel and Sass.

``` text
Vue CLI v3.5.5
┌───────────────────────────┐
│  Update available: 3.6.2  │
└───────────────────────────┘
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◯ Router
 ◯ Vuex
❯◉ CSS Pre-processors
 ◯ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

When it completes, follow the on-screen instructions to run the dev server:

``` sh
cd vue-multipage-test
yarn serve
```

Everthing should be working as usual.


### Set up multipage mode

Get the project set up for multipage mode by creating a `vue.config.js` with
the following contents to start:

``` js
module.exports = {
  pages: {
    'index': 'src/entry/index.js',
  },
};
```

You can read more in [the Vue CLI config docs on pages][pages-config].

Move `src/main.js` to `src/entry/index.js` and make sure it has the following
contents: (notice the src-relative import `@/pages/index.vue`)

``` js
import Vue from "vue";
import page from "@/pages/index.vue";

new Vue({
  render: h => h(page),
}).$mount('#app');
```

Now move `src/App.vue` to `src/pages/index.vue` and again tweak the logo and
HelloWorld paths to use the src-relative imports (`@/path/to/resource`).

``` html
<template>
  <div id="app">
    <img alt="Vue logo" src="@/assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

The build should now succeed.

### Adding a second page

Now create `src/pages/foo.vue` with the following content:

``` html
<template>
  <span>foo</span>
</template>
```

Then create `src/entry/foo/index.js` with the following content:

``` js
import Vue from "vue";
import page from "@/pages/foo.vue";

new Vue({
  render: h => h(page),
}).$mount('#app');
```

Finally, go to `vue.config.js` and add a new entry for this page:

``` js
module.exports = {
  pages: {
    'index': 'src/entry/index.js',
    'foo/index': 'src/entry/foo/index.js',
  },
};
```

Restart your dev server and try going to `/foo`. You should see just the word
"foo".

### Add a navigation component

Let's add some navigation to see how moving between pages works. Create
`src/components/Navigation.vue` and place the following content into it:

``` html
<template>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/foo">Foo</a></li>
    </ul>
  </nav>
</template>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  
  li:not(:last-child) {
    margin-right: 16px;
  }
</style>
```

Then change `src/pages/index.vue` to:

``` html
<template>
  <div id="app">
    <Navigation/>
    <img alt="Vue logo" src="@/assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    Navigation,
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

Similarly, change `src/pages/foo.vue` to:

``` html
<template>
  <div id="app">
    <Navigation/>
    <span>foo</span>
  </div>
</template>

<script>
  import Navigation from "@/components/Navigation.vue";
  
  export default {
    components: {
      Navigation,
    },
  };
</script>
```

### Share styles

These two pages don't quite look alike, so let's share styles.

Create `src/styles.scss` with the following content (from the `<style>` block in
`src/pages/index.vue`):

``` scss
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
```

Then, in `src/pages/index.vue`, replace the `<style>` block with the following:

``` html
<style lang="scss">
  @import "@/styles.scss";
</style>
```

Now add the same `<style>` block above to the bottom of `src/pages/foo.vue`.

Click back and forth between pages in the app to see things looking a little
more uniform.

### Autogenerate pages config and entry points

It would be fine to manually create a `src/entry/bar/index.js` entry point file
for every  `src/pages/bar.vue` and add a new line to the `vue.config.js` file,
but why not automate that so that we can just create `.vue` files in `src/pages`
and the rest happens automatically?

Create `scripts/generate-entry-points.js` with the following contents:

``` js
const path = require("path");
const glob = require("fast-glob");
const fse = require("fs-extra");
const R = require("ramda");
const { stripIndent } = require("common-tags");

const pathGlob = processRelativePath("../src/pages/**/*.vue");
const vuePagesPromise = glob(pathGlob);

console.log(`Generating entry points`);

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
fse.removeSync(entryFolderPath);
console.log(`Cleared ${entryFolderPath}`);

// Step 3: create a corresponding entry point file for each page
pagesConfigPromise.then(config => {
  config.forEach(page => {
    fse.outputFileSync(page.entryFilePath, page.entryFileContent);
    console.log(`Created ${page.entryFilePath}`);
  });
});

// Step 4: create a pages.config.js
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
  .then(() => console.log(`Created ${pagesConfigPath}`));


function pageConfigContent(config) {
  return stripIndent`
    module.exports = ${JSON.stringify(config, null, 2)};
  `;
}

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
```

Install some new dependencies:

``` sh
yarn add --dev fast-glob fs-extra nodemon npm-run-all # likely to be used only in dev
yarn add ramda common-tags # likely to be used in our app runtime
```

Now update the `scripts` section of your `package.json` file with the following:

``` json
{
  "scripts": {
    "dev": "run-p dev:pages dev:server:watch",
    "dev:pages": "nodemon --watch src/pages --watch scripts/generate-entry-points.js scripts/generate-entry-points.js",
    "dev:server": "vue-cli-service serve",
    "dev:server:watch": "nodemon --watch vue.config.js --watch 'src/**/*.js' --watch package.json --exec 'yarn run dev:server'",
    "build": "vue-cli-service build"
  }
}
```

Now run the `dev` script:

``` sh
yarn run dev
```

Notice that a new `src/entry/pages.config.js` file was created with the
following contents:

``` js
module.exports = {
  "foo/index": "src/entry/foo/index.js",
  "index": "src/entry/index.js"
};
```

Let's go back to our `vue.config.js` file and replace the config option there
with a reference to this file. Change your `vue.config.js` to the following:

``` js
const pagesConfig = require("./src/entry/pages.config.js");

module.exports = {
  pages: pagesConfig,
};
```

Next, create `src/pages/bar.vue` with the following contents:

``` html
<template>
  <div id="app">
    <Navigation/>
    bar
  </div>
</template>

<script>
  import Navigation from "@/components/Navigation.vue";
  
  export default {
    components: {
      Navigation,
    },
  };
</script>

<style lang="scss">
  @import "@/styles.scss";
</style>
```

Now, update the `<template>` block in `src/components/Navigation.vue` to the
following:

``` html
<template>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/foo">Foo</a></li>
      <li><a href="/bar">Bar</a></li>
    </ul>
  </nav>
</template>
```

Finally, stop and start your dev server and click around.


### Fix dev server history fallback

If you try to go to a URL that doesn't match a page we've created, such as
`/does-not-exist`, you'll notice that it happily just serves the index page.
That's not correct, so let's fix it. Go to `vue.config.js` and change it to:

``` js
const pagesConfig = require("./src/entry/pages.config.js");

module.exports = {
  pages: pagesConfig,
  devServer: {
    historyApiFallback: false,
  },
};
```

Now try visting a URL that doesn't match a page we've defined and notice that it
serves a 404 response. Let's customize that.

Create `src/pages/404.vue` with the following content:

``` html
<template>
  <div id="app">
    <h1>404</h1>
    <p>Oops! We couldn't find that resource</p>
  </div>
</template>
```

Then update the `vue.config.js` file to match the following:

``` js
const path = require("path");
const pagesConfig = require("./src/entry/pages.config.js");

module.exports = {
  pages: pagesConfig,
  devServer: {
    historyApiFallback: false,
    writeToDisk: true,
    after: devServer => {
      // if devServer hasn't responded to the request, we can assume no matches
      devServer.use((req, res, next) => {
        const notFoundPage = path.resolve(__dirname, "./dist/404/index.html");
        res.status(404).sendFile(notFoundPage);
      });
    },
  },
};
```

Restart your dev server and notice our custom 404 page is served.

Let's clean this up a bit by moving that 404 logic to a separate file. Create
`src/api/404.js` with the following content:

``` js
const path = require("path");
const express = require("express");

const app = express();

app.use((req, res, next) => {
  const notFoundPage = path.resolve(__dirname, "../../dist/404/index.html");
  res.status(404).sendFile(notFoundPage);
});

module.exports = app;
```

Then update `vue.config.js` to the following:

``` js
const pagesConfig = require("./src/entry/pages.config.js");
const notFoundHandler = require("./src/api/404.js");

module.exports = {
  pages: pagesConfig,
  devServer: {
    historyApiFallback: false,
    writeToDisk: true,
    after: devServer => {
      // if devServer hasn't responded to the request, we can assume no matches
      devServer.use(notFoundHandler);
    },
  },
};
```

Now, let's make express an explicit dependency:

``` sh
yarn add express
```

If we click around we should see everything working as expected.


### Adding an API server

Every app needs an API server for things like authentication and handling data
requests from our pages, so let's create one.

Create `src/api/index.js` with the following content:

``` js
const path = require("path");
const fse = require("fs-extra");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the
// credentials (`username` and `password`) submitted by the user.  The function
// must verify that the password is correct and then invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new LocalStrategy(
    async function verify(username, password, cb) {
      console.log(`passport verify()`, {username, password});
      // NOTE: fake authentication here, replace with your own auth logic
      const user = {
        username,
      };
      
      if (user) {
        // successful login
        return cb(null, user);
      } else {
        // failed login
        return cb(null, false);
      }
    }
  )
);


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

// Create a new Express application.
const app = express();
app.enable("trust proxy");

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: "CHANGE ME!",
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Marking URLs that require login
const loginRequired = (req, res, next) => {
  if (!req.user) {
    res.redirect(`/login?returnTo=${encodeURIComponent(req.url)}`)
  } else {
    next();
  }
};
app.get("/foo", loginRequired);
app.get("/bar", loginRequired);
app.get("/baz", loginRequired);
app.get("/profile", loginRequired);

app.get("/login", (req, res, next) => {
  console.dir(req.session);
  next();
});

app.post("/login", (req, res, next) => {
  console.log(`POST /login`);
  passport.authenticate("local", (err, user, info) => {
    console.log(`passport.authenticate`, {err, user, info});
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(403).json({
        error: info.message,
      });
    }
    
    req.login(user, (err) => {
      if (err) {
        return next(err);
      } else {
        return res.json({
          user: user,
          returnTo: req.session.returnTo,
        });
      }
    });
  })(req, res, next);
});

app.get("/whoami", loginRequired, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports.apiServer = app;

if (require.main === module) {
  // FIXME: static serving for dist folder
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}
```

Next, let's add these dependencies:

``` sh
yarn add body-parser cookie-parser morgan express-session passport passport-local
```

Then, let's compose this API server with the devServer by updating
`vue.config.js` to:

``` js
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
```

We added a login handler, but we don't have a login page yet. Let's create
`src/pages/login.vue` with the following content:

``` html
<template>
  <div id="app">
    <Navigation/>
    <form
      @submit.prevent="submit"
      action="/login"
      method="POST"
    >
      <label style="display: block">
        User name<br/>
        <input type="text" name="username" v-model="username"/>
      </label>
      <label style="display: block">
        Password<br/>
        <input type="password" name="password" v-model="password"/>
      </label>
      <div v-if="error" style="background: red; padding: 8px; color: white;">
        {{ error }}
      </div>
      <button type="submit">Log in</button>
    </form>
  </div>
</template>

<script>
  import axios from "axios";
  import Navigation from "@/components/Navigation.vue";
  
  
  export default {
    components: {
      Navigation,
    },
    data: () => ({
      username: "",
      password: "",
      error: null,
    }),
    methods: {
      submit(event) {
        axios
          .post("/login", {
            username: this.username,
            password: this.password,
          })
          .then(response => response.data)
          .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            window.location = urlParams.get("returnTo") || "/";
          })
          .then(console.log)
          .catch(error => {
            this.error = error.response.data.error;
          });
      },
    },
  };
</script>

<style lang="scss">
  @import "@/styles.scss";
</style>

```

We just need to install the axios dependency before restarting the dev server to
try things out.

``` sh
yarn add axios
```

Finally, let's give users a way of logging out. Update
`src/components/Navigation.vue` to the following:

``` html
<template>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/foo">Foo</a></li>
      <li><a href="/bar">Bar</a></li>
      <li v-if="signedIn"><a href="/logout">Logout</a></li>
    </ul>
  </nav>
</template>

<script>
  import axios from "axios";
  
  const signedInPromise =
    axios
      .get("/whoami")
      .then(response => response.data)
      .then(data => {
        try {
          return Boolean(data.user.username);
        } catch (error) {
          return false;
        }
      });
  
  export default {
    data: () => ({
      signedIn: false,
    }),
    mounted() {
      signedInPromise.then(signedIn => this.signedIn = signedIn);
    },
  };
</script>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  
  li:not(:last-child) {
    margin-right: 16px;
  }
</style>
```

[pages-config]: https://cli.vuejs.org/config/#pages
