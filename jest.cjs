module.exports = {
    preset: "ts-jest/presets/default-esm",
    transform: {
        '^.+\\.tsx?$': {
            "ts-jest": {
                useESM: true,
            },
        }
    },
    testEnvironment: "node",
    verbose: true,
    testPathIgnorePatterns: ["<rootDir>/dist/"]
};