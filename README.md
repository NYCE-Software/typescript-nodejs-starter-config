# @nyce/config

https://www.npmjs.com/package/@nyce/config

Common and very opinionated configuration files for use across various projects. Import only what you need, extend to fill any gaps and keep some of that valuable time to focus on your code.

If you prefer a vanilla JavaScript/TypeScript experience, this probably isn't for you.

## What's in the box

| File            | Tool       | How you consume it                                        |
| --------------- | ---------- | --------------------------------------------------------- |
| `tsconfig.json` | TypeScript | `"extends": "@nyce/config/tsconfig.json"`                 |
| `.swcrc`        | SWC        | Copied into your project root (SWC can't extend configs)  |
| `jest.cjs`      | Jest       | `require("@nyce/config/jest.cjs")`                        |
| `prettier.cjs`  | Prettier   | `"prettier": "@nyce/config/prettier.cjs"`                 |
| `nodemon.json`  | nodemon    | `nodemon --config node_modules/@nyce/config/nodemon.json` |

> **ESLint moved out.** The ESLint configuration is no longer part of this package — it lives in
> [@nyce/eslint-config](https://www.npmjs.com/package/@nyce/eslint-config).

## Requirements

The configuration files assume the following:

- **Node.js 24 or newer**;
- [ECMAScript modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules); and
- [TypeScript 6](https://www.typescriptlang.org/) with `@types/node` 24 (both are peer dependencies).

Add the following entry to (the top of) your `package.json` file to use the Ecmascript Module Loader on your project files:

```json
{
    "type": "module"
}
```

### Use explicit file extensions

The config uses `"moduleResolution": "nodenext"`, so relative and aliased imports need the emitted `.js` extension — even when the file on disk is a `.ts` file:

```ts
import { thing } from "./lib/thing.js";
import { other } from "@lib/other.js";
```

> Older versions of this README recommended running Node with `--experimental-specifier-resolution=node` to skip the extensions. That flag is a no-op on modern Node — extensionless imports still fail with `ERR_MODULE_NOT_FOUND`. Use the extensions.

## Installation

```bash
pnpm add -D @nyce/config typescript@^6 @types/node@^24.12
```

## Usage

### TypeScript

Create a `tsconfig.json` in your project root and extend from the NYCE config:

```json
{
    "extends": "@nyce/config/tsconfig.json",
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist",
        "types": ["node"],
        "paths": {
            "@src/*": ["./src/*"],
            "@lib/*": ["./src/lib/*"],
            "@controllers/*": ["./src/controllers/*"]
        }
    },
    "include": ["src"]
}
```

Those four overrides are not optional — TypeScript resolves relative paths in an inherited config against the file that _declares_ them, which is `node_modules/@nyce/config/tsconfig.json`:

- **`rootDir` / `outDir`** — without them, every one of your files sits outside the inherited `rootDir` and the compiler bails out with `TS6059: File ... is not under 'rootDir'`.
- **`paths`** — the inherited aliases point at the package's own `src` directory, so `import { x } from "@lib/x.js"` fails with `TS2307: Cannot find module`. Redeclare them and they resolve against your project.
- **`types`** — the base config sets `"types": ["node"]`, which switches off automatic `@types` discovery. Add anything else you need to the list (see the Jest section).

> **Don't add `baseUrl`.** It is deprecated in TypeScript 6 (`TS5101`) and removed in TypeScript 7 (`TS5102`). Path aliases work through `paths` alone.

### SWC compiler

SWC still doesn't support extending configuration files, and pointing `--config-file` at the copy inside `node_modules` fails because SWC canonicalizes `baseUrl` relative to the `.swcrc` — you get `failed to canonicalize base url using the path of .swcrc`.

So copy the file into your project root instead:

```json
{
    "scripts": {
        "postinstall": "cp node_modules/@nyce/config/.swcrc .swcrc",
        "build": "swc --strip-leading-paths ./src -d dist"
    }
}
```

> On Windows, install [shx](https://www.npmjs.com/package/shx) as a devDependency and use `shx cp` instead of `cp`.

`--strip-leading-paths` keeps the output flat (`dist/index.js` rather than `dist/src/index.js`). Path aliases are rewritten to relative specifiers on the way out, so the emitted code runs on plain Node.

#### NPM `start` script

```json
{
    "start": "node dist/<YOUR-FILE-NAME-HERE>.js"
}
```

_Make sure to replace `<YOUR-FILE-NAME-HERE>.js` with the file you want to run._

### Jest

Install `jest` and `ts-jest` alongside this package, then create a `jest.config.mjs` in your project root:

```js
import { createRequire } from "node:module";
import { pathsToModuleNameMapper } from "ts-jest";

const require = createRequire(import.meta.url);
const nyceBaseOptions = require("@nyce/config/jest.cjs");
const { compilerOptions } = require("./tsconfig.json");

export default {
    ...nyceBaseOptions,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
        prefix: "<rootDir>/",
        useESM: true,
    }),
};
```

The mapper reads the aliases from _your_ `tsconfig.json` (see the TypeScript section), and `useESM: true` teaches it to strip the `.js` extension off imports so Jest finds the `.ts` source.

Add the Jest globals and `isolatedModules` to your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "types": ["node", "jest"],
        "isolatedModules": true
    }
}
```

Without `"jest"` in `types` the compiler doesn't know `describe`/`it`/`expect` (`TS2593`); without `isolatedModules` ts-jest warns about the hybrid module kind (`TS151002`).

#### NPM `test` script

```json
{
    "test": "NODE_OPTIONS=--experimental-vm-modules jest --coverage"
}
```

> A `jest.config.ts` also works, but Jest needs `ts-node` installed to read it. The `.mjs` variant above avoids that dependency.

### Prettier

Point the `prettier` key in your `package.json` at the config:

```json
{
    "prettier": "@nyce/config/prettier.cjs"
}
```

> Include the `.cjs` extension. `"@nyce/config/prettier"` does not resolve — Node won't guess the extension for a package subpath.

#### NPM `format` scripts

```json
{
    "format": "prettier --check .",
    "format:fix": "prettier --write ."
}
```

> `--loglevel` was renamed to `--log-level` in Prettier 3; the old spelling is silently ignored.

### Nodemon

Run nodemon with a `--config` parameter pointing to this package's `nodemon.json` file and specify a file to watch:

```bash
npx nodemon --config node_modules/@nyce/config/nodemon.json src/<YOUR-FILE-NAME-HERE>.ts
```

_Make sure to replace `<YOUR-FILE-NAME-HERE>.ts` with the file you want to watch._

#### NPM `watch` script

```json
{
    "watch": "nodemon --config node_modules/@nyce/config/nodemon.json src/<YOUR-FILE-NAME-HERE>.ts"
}
```

The config runs `pnpm format && pnpm lint & pnpm build && pnpm start` on every change, so your project needs those four scripts (replace `pnpm` with `npm` by shipping your own nodemon config if you're not on pnpm).
