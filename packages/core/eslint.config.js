import js from "@eslint/js"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import testingLibrary from "eslint-plugin-testing-library"
import { fixupPluginRules } from "@eslint/compat"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["**/dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none"
        }
      ],
      "no-extra-semi": "off"
    }
  },
  {
    files: ["src/**/*.{spec,test}.{ts,tsx}"],
    plugins: {
      "testing-library": fixupPluginRules({
        rules: testingLibrary.rules
      })
    },
    rules: {
      ...testingLibrary.configs.rules,
      "testing-library/no-container": "off",
      "testing-library/no-node-access": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
)
