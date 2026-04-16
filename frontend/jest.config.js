/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^.+\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/",
        "<rootDir>/e2e/", // Playwright E2E tests
        "<rootDir>/__tests__/helpers/", // Shared test utilities, not suites
    ],
};

module.exports = createJestConfig(customJestConfig);
