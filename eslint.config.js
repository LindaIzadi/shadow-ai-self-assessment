const js = require("@eslint/js");
const globals = require("globals");

const GEMEINSAM = {
  eqeqeq: "error",
  "no-implicit-globals": "error",
  "no-shadow": "error",
  "no-console": "off",
};

module.exports = [
  { ignores: ["node_modules/", "_site/"] },
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",
      globals: { ...globals.browser, module: "readonly" },
    },
    rules: { ...GEMEINSAM, strict: ["error", "function"] },
  },
  {
    files: ["test/**/*.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.browser },
    },
    rules: GEMEINSAM,
  },
];
