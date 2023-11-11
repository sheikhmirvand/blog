/** @type {import('jest').Config} */
const config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.spec.ts"],
};

module.exports = config;
