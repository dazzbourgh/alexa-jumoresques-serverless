module.exports = {
    setupFiles: ["<rootDir>/jest/env.js"],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "<rootDir>/test/**/*.test.(ts|js)"
    ],
    testEnvironment: "node"
};
