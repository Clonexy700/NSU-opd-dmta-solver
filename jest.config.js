// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
   
  transform: {
     '.js': 'jest-esm-transformer',
  },

  clearMocks: true,

  coverageDirectory: "coverage",

 
  testEnvironment: "jsdom",
};
