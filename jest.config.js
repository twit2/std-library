/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts"
    ],
    coveragePathIgnorePatterns: [
        "node_modules",
        "src/op",
        "src/middleware",
        "src/session",
        "src/types",
        "src/uam",
        "src/util",
        "src/Index.ts",
        "src/Limits.ts"
    ]
};