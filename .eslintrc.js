module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["prettier", "eslint:recommended"],
  parser: "@babel/eslint-parser",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "linebreak-style": ["error", "unix"],
  },
  "plugins": ["prettier"],
};
