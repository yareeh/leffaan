module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "plugin:react/recommended",
        "airbnb",
        "airbnb-typescript",
        "prettier",
        "plugin:react-hooks/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": ["error", { tabWidth: 4 }],
        "react/require-default-props": [1],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "jsx-a11y/label-has-associated-control": ["error", {
            "required": {
                "some": ["nesting", "id"]
            }
        }],
        "@typescript-eslint/no-redeclare": ["off"]
    },
};
