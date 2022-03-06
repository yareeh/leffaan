module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "next/core-web-vitals",
        "prettier",
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
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": ["error", { tabWidth: 4 }],
        "semi": [ "error", "never" ],
        "@typescript-eslint/no-redeclare": ["off"]
    },
};
