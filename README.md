# AION Mono UI

## One-time setup

- Have Node installed. See the Jenkinsfile for the correct version.
- `npm install -g yarn`
- `yarn install` (from this dir)

## Usage

- `yarn build:packages` creates build artifacts for every package. Like `yarn install`, this is necessary before starting an application for the first time ever.
- `yarn start app-name` runs the specified application for local dev. Replace `app-name` with an application under the applications folder.
- `yarn build` creates build artifacts for every application
- `yarn test` runs all tests
- `yarn clean` removes the `node_modules` directory from all packages and applications

### Lerna filters

Lerna has a number of [filter options](https://github.com/lerna/lerna/tree/master/core/filter-options) that can be applied to the above commands.

For example, running a build for a specific package would look something like `yarn build --scope aion-subscriber-ui`.

### Proxy settings

By default, `yarn start app-name` proxies API requests to json-server on localhost:4000. This behavior can be overridden by passing a proxy argument.

To proxy to vagrant: `yarn start app-name --proxy=vagrant`

To proxy to dev: `yarn start app-name --proxy=dev`

To proxy to beta: `yarn start app-name --proxy=beta`

### Create React App

Applications are bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Lerna & Yarn workspaces

[Lerna](https://github.com/lerna/lerna) and [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) help manage dependencies and internal packages.

## Publishing packages

**NOTE: These steps only apply if you've made changes to any files under the packages directory!**

1. Create a branch off `development` and make normal commits of your changes.
2. Create a PR for code review when you're ready for your changes to be merged.
3. After code review, when you are ready to merge, Bitbucket brings up a **Merge pull request** modal as seen in the image below. In the **commit message** input box make a [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/#specification) that describes the changes you've made.
4. Click the **merge** button.

### Commonly used Conventional Commit prefixes

Use `feat:` for a new, non-breaking feature. It will publish a new minor version.

![Bitbucket's merge pull request modal](https://i.imgur.com/zxAunnw.png)

Use `fix:` for a non-breaking bug fix. It will publish a new fix version.

Use `feat:` **and** `BREAKING CHANGE:` for a breaking change. It will publish a new major version. Example:

```
feat: Merged in SF-796-check-subscriptions (pull request #466)

BREAKING CHANGE: Make nav link require Verification Package subscription

* SF-796: Make nav link require Verification Package subscription

* Fix fixtures

* Fix fix fixtures

Approved-by: Joey Reed <joey@pecsafety.com>
Approved-by: Blake Hobratschk <blake.hobratschk@veriforce.com>
```

### Did you forget to make a conventional commit?

Create a new commit with the missing conventional commit message to upgrade required packages and trigger a build.

### Adding or upgrading packages in another repo

If you try to `yard add` or `yarn upgrade` an aion package in a project outside this repo, you may receive an error like this:

```
dan@dan:~/repos/www/src/SSQV5$ yarn upgrade @pec/aion-ui-core@10.0.1
error An unexpected error occurred: "https://registry.yarnpkg.com/@pec%2faion-ui-core: Not found".
```

The registry for aion packages should be our myget private repo, not yarn's default. These commands should correct the issue:

```
API_KEY=a577c1c3-2801-4035-8cfc-6e412f880e25
yarn config set strict-ssl false
yarn config set "@pec:registry" "https://www.myget.org/F/pec-lib/auth/${API_KEY}/npm/"
```
# ui-mono
