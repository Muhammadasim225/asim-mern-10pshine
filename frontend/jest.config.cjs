module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
    },
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    setupFiles: ['./jest.setup.js'],  
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
  };


  