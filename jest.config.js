// jest.config.js
export default {
    testEnvironment: 'node',
    transform: {},
    roots: ['<rootDir>'],
    moduleFileExtensions: ['js', 'mjs','json'],
    coverageDirectory: 'coverage',
    testMatch: ['**/*.test.js', '**/*.test.mjs'],
    collectCoverageFrom: ['/**/*.js', '/**/*.mjs','/**/*.test.mjs', '/**/*.test.js']
};
