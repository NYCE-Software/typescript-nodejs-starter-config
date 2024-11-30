# @nyce/config

https://www.npmjs.com/package/@nyce/config

Common and very opinionated configuration files for use across various projects. Import only what you need, extend to fill any gaps and keep some of that valuable time to focus on your code.

If you prefer a vanilla JavaScript/TypeScript experience, this probably isn't for you.

## Installation

```bash
npm install @nyce/config
```

## Requirements

The configuration files assume the following is enabled:

- [ECMAScript modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules); and
- The TC39 proposal ['Top-level await'](https://github.com/tc39/proposal-top-level-await);

Add the following entry to (the top of) your `package.json` file to use the Ecmascript Module Loader on your project files:

```json
{
    "type": "module"
}
```

**Optional but recommended:** Run NodeJS with the `--experimental-specifier-resolution=node` flag for`imports` without specific file extensions:

```bash
node --experimental-specifier-resolution=node dist/<YOUR-FILE-NAME-HERE>.js
```

_Make sure to replace `<YOUR-FILE-NAME-HERE>.js` with the file you want to run._

## Usage

### TSconfig

Create a file in your project root called `tsconfig.json` and extend from the NYCE config.

```json
{
    "extends": "@nyce/config/tsconfig.json",
    "compilerOptions": {
        "baseUrl": "src"
    },
    "include": ["src"]
}
```

### SWC compiler

> Unlike TSC, SWC doesn't support config extension yet. ~~For now, you can load the config file with an absolute path to `node_modules`~~.
>
> > ~~Alternatively you could (automatically) copy the file over to your project.~~
>
> > **UPDATE:** In latest versions of SWC loading to an absolute NODE_MODULES path breaks the base url.
> >
> > ...Updated the section below to provide a working solution until SWC supports extending configuration files.
>
> > SHX is now a peerdependency, so make sure to install that with
> > `bash `

#### Add the following NPM scripts to copy the config post-install

> Replace `pnpm` with `npm` in the postinstall script if you use npm instead of pnpm.

```json
{
    "postinstall": "pnpm copy-swc-config",
    "copy-swc-config": "shx cp node_modules/@nyce/config/.swcrc .swcrc",
    "build": "npx swc --config-file .swcrc ./src -d dist"
}
```

#### NPM `build` script:

```json
{
    "build": "npx swc --config-file node_modules/@nyce/config/.swcrc ./src -d dist"
}
```

#### NPM `start` script:

```json
{
    "start": "node --experimental-specifier-resolution=node dist/<YOUR-FILE-NAME-HERE>.js"
}
```

_Make sure to replace `<YOUR-FILE-NAME-HERE>.js` with the file you want to run._

### jest

Create a file in your project root called `jest.config.ts` with the following contents:

```typescript
import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";

export default async (): Promise<Config.InitialOptions> => {
    const { compilerOptions } = await require("@nyce/config/tsconfig.json");
    const nyceBaseOptions: Config.InitialOptions = await require("@nyce/config/jest.cjs");

    return {
        ...nyceBaseOptions,
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }) ?? {},
    };
};
```

#### NPM `test` script:

```json
{
    "test": "NODE_OPTIONS=--experimental-vm-modules npx jest --coverage"
}
```

### Prettier and ESlint (package.json)

> [ESLINT forces you to use a prefix on your WHOLE DAMN NPM PACKAGE](https://eslint.org/docs/latest/developer-guide/shareable-configs#npm-scoped-modules) (seriously?!).
>
> We serve multiple configuration files in this package so prefixing it with `eslint-config-` would be confusing. The ESlint configuration can be imported by using an absolute path.

```json
{
    "prettier": "@nyce/config/prettier",
    "eslintConfig": {
        "extends": "./node_modules/@nyce/config/eslint"
    }
}
```

#### NPM `lint` and `format` scripts:

```json
{
    "lint": "eslint './src/**/*.ts' --ext .ts",
    "lint:fix": "eslint './src/**/*.ts' --ext .ts --fix",
    "format": "prettier --loglevel=warn --write src"
}
```

### Nodemon (package.json)

Run Nodemon with a `--config` parameter pointing to this packages' `nodemon.json` file and specify a file to watch:

```bash
npx nodemon --config node_modules/@nyce/config/nodemon.json src/<YOUR-FILE-NAME-HERE>.ts"
```

_Make sure to replace `<YOUR-FILE-NAME-HERE>.ts` with the file you want to watch._

#### NPM `watch` script:

```json
{
    "watch": "npx nodemon --config node_modules/@nyce/config/nodemon.json src/<YOUR-FILE-NAME-HERE>.ts"
}
```

_Make sure to replace `<YOUR-FILE-NAME-HERE>.ts` with the file you want to watch._
