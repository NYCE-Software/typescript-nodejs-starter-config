# @nyce/config

https://www.npmjs.com/package/@nyce/config

Common and very opiniated configuration files for use across various projects. Import only what you need, extend to fill any gaps and keep some of that valueable time to focus on your code.

If you prefer a vanilla JavaScript/TypeScript experience, this probably isn't for you.

## Installation

```bash
npm install @nyce/config
```

## Usage

### TSconfig

Create a file in your project root called `tsconfig.json` and extend from the NYCE config.

```json
{
  "extends": "@nyce/config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src",
  },
  "include": ["src"]
}
```

### SWC compiler

> Unlike TSC, SWC doesn't support config extension yet. For now, you can load the config file with an absolute path to `node_modules`. 
>> Alternatively you could (automatically) copy the file over to your project.

Run SWC with the --config-file parameter:

```bash
npx swc --config-file node_modules/@nyce/config/.swcrc
```

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
