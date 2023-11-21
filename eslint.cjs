module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        // TypeScript
        "@typescript-eslint",
        // Security
        "no-secrets",
        "xss",
        // Optimization
        "regexp",
        "require-extensions",
    ],
    parserOptions: {
        ecmaVersion: "latest", // Allows the use of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        project: "tsconfig.json",
    },
    extends: [
        "eslint:recommended",
        "plugin:require-extensions/recommended",
        // TypeScript
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        // Code style
        "prettier",
        // Security
        "plugin:no-unsanitized/DOM",
        "plugin:pii/recommended",
        // Optimization
        "plugin:regexp/recommended",
    ],
    settings: {
        "import/resolver": {
            typescript: true,
            node: true,
        },
    },
    env: {
        node: true, // Enable Node.js global variables
    },
    rules: {
        curly: "error",
        // no-dob rule has a bug which crashes on loops, turned off.
        "pii/no-dob": "off",
        // Debugging
        "no-console": "warn",
        // Type
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-inferrable-types": [
            "off",
            {
                ignoreParameters: true,
            },
        ],
        "@typescript-eslint/typedef": [
            "error",
            {
                arrowParameter: true,
                variableDeclaration: true,
            },
        ],
        // Security
        "no-secrets/no-secrets": "error",
        "xss/no-mixed-html": "error",
        "xss/no-location-href-assign": "error",
    },
};
