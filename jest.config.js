module.exports = {
  testEnvironment: "node",
 " --experimental - vm - modules node_modules / jest / bin / jest.js",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@babel)/)"
  ],


};
