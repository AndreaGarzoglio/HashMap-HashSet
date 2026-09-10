module.exports = {
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
  },
  collectCoverageFrom: ["src/**/*.js", "!src/index.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
