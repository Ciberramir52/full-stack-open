import stylistic from "@stylistic/eslint-plugin-js";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    plugins: {
        "@stylistic/js": stylistic,
    },

    ignores: [".eslintrc.js", "eslint.config.mjs", "dist", "models"],

    languageOptions: {
        globals: {
            ...globals.commonjs,
            ...globals.node,
        },

        ecmaVersion: "latest",
        sourceType: "commonjs",
        parserOptions: {
            "sourceType": "module",
        }
    },

    rules: {
        "@stylistic/js/indent": ["error", 2],
        "@stylistic/js/linebreak-style": ["error", "unix"],
        "@stylistic/js/quotes": ["error", "single"],
        "@stylistic/js/semi": ["error", "never"],
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],

        "arrow-spacing": ["error", {
            before: true,
            after: true,
        }],

        "no-console": 0,
    },
}, {
    files: ["**/.eslintrc.{js,cjs}"],

    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 5,
        sourceType: "commonjs",
    },
}];