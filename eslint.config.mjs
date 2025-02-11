import nyceConfig from "@nyce/eslint-config";

export default [
    ...nyceConfig,
    {
        ignores: ["node_modules", "test", "jest.config.ts"],
    },
];
