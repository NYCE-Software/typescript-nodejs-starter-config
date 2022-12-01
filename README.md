# config

Common configuration files used across projects

## Usage

### package.json

> [ESLINT forces you to use a prefix on your WHOLE DAMN NPM PACKAGE](https://eslint.org/docs/latest/developer-guide/shareable-configs#npm-scoped-modules) (seriously?!).
>
> We serve multiple configuration files in this package so prefixing it with `eslint-config-` would be confusing. The ESlint configuration can be imported by using an absolute path.

````json
{
  "prettier": "@nyce/config/prettier",
  "eslintConfig": {
    "extends": "./node_modules/@nyce/config/eslint"
  }
}
```