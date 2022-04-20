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


