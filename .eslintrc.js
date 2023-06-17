module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["airbnb-base"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "always"],
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        "no-underscore-dangle": ["error", { allow: ["_id"] }],
    },
};
