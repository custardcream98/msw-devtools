module.exports = {
  plugins: ["react", "react-hooks"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react/boolean-prop-naming": ["error"],
    "react/button-has-type": ["error"],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function"
      }
    ],
    "react/hook-use-state": ["error"],
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-child-element-spacing": ["error"],
    "react/jsx-closing-bracket-location": ["error"],
    "react/jsx-curly-newline": ["error"],
    "react/jsx-curly-spacing": [
      "error",
      {
        children: true,
        when: "never"
      }
    ],
    "react/jsx-equals-spacing": ["error"],
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".tsx"]
      }
    ],
    "react/jsx-handler-names": ["error"],
    "react/jsx-no-constructed-context-values": ["error"],
    "react/jsx-no-useless-fragment": [
      "error",
      {
        allowExpressions: true
      }
    ],
    "react/jsx-pascal-case": ["error"],
    "react/jsx-props-no-multi-spaces": ["error"],
    "react/jsx-tag-spacing": [
      "error",
      {
        beforeClosing: "never"
      }
    ],
    "react/jsx-wrap-multilines": ["error"],
    "react/no-unstable-nested-components": ["error"],
    "react/no-unused-state": ["error"],
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": [
      "error",
      {
        html: false
      }
    ],
    "react/sort-default-props": ["error"]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
