import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
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
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none"
        }
      ]
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
      ...testingLibrary.configs["flat/react"].rules,
      "testing-library/no-container": "off",
      "testing-library/no-node-access": "off"
    }
  }
  // {
  //   files: ["src/**/*.{spec,test}.{ts,tsx}"],
  //   ...fixupPluginRules(testingLibrary.configs["flat/react"])
  //   // plugins: {
  //   //   "testing-library": fixupPluginRules({
  //   //     rules: testingLibrary.rules
  //   //   })
  //   // },
  //   // rules: testingLibrary.configs["flat/react"].rules
  // }
)
