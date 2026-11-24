import base from "./vendor/arnes/eslint.config.mjs";
import parser from "@typescript-eslint/parser";
export default [
  ...base,
  {
    files: ["src/**/*.ts"],
    languageOptions: { parser, ecmaVersion: "latest", sourceType: "module" },
    rules: {
      eqeqeq: "error",
      "no-constant-condition": "error",
      "no-unreachable": "error",
    },
  },
];
