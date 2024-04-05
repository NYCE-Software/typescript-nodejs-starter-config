import basePrettierConfig from "./prettier.cjs";

export default {
    ...basePrettierConfig,
    plugins: ["prettier-plugin-svelte"],
    pluginSearchDirs: ["."],
    overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
