/** @type {import('eslint').ESLint.ConfigData} */
const config = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["plugin:import/recommended"],
  ignorePatterns: ["node_modules/", "dist/", "build/"],
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript"
      ],
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"]
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/ban-types": [
          "error",
          {
            extendDefaults: true,
            types: {
              "{}": false
            }
          }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_"
          }
        ]
      },
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
          typescript: {
            project: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"]
          }
        }
      }
    }
  ],
  plugins: ["sort-keys-fix", "simple-import-sort", "import"],
  rules: {
    "array-callback-return": [
      "error",
      {
        allowImplicit: true
      }
    ],
    "comma-spacing": ["error"],
    eqeqeq: ["error"],
    "import/default": "off",
    "import/export": "off",
    "import/namespace": "off",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "import/no-unresolved": "error",
    "import/no-unused-modules": ["off", { unusedExports: true }],
    "linebreak-style": ["error", "unix"],
    "no-await-in-loop": ["error"],
    "no-constant-binary-expression": ["error"],
    "no-duplicate-imports": ["error"],
    "no-self-compare": ["error"],
    "no-unmodified-loop-condition": ["error"],
    quotes: ["error", "double", { avoidEscape: true }],
    radix: ["error"],
    "require-await": ["error"],
    semi: "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^\\u0000"],
          ["^src(/.*|$)"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ["^.+\\.?(css)$"]
        ]
      }
    ],
    "sort-keys-fix/sort-keys-fix": "warn",
    "space-before-blocks": ["error"]
  }
}

module.exports = config
