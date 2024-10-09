import { Override } from "../factory";
import { Linter } from 'eslint';
import global from 'globals';

export const javascript = (
    overrides: Override,
    languageOptions?: Linter.Config['languageOptions'],
    linterOptions?: Linter.Config['linterOptions'],
    plugins?: Linter.Config['plugins']
) => {
    return [
        {
            name: 'gaonengwww/javascript/setup',
            languageOptions: {
                ecmaVersion: 2022,
                globals: {
                    ...global.browser,
                    ...global.node,
                    ...global.es2015,
                    document: 'readonly',
                    window: 'readonly',
                    navigator: 'readonly'
                },
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        ...languageOptions?.parserOptions?.ecmaFeatures ?? {}
                    },
                    ecmaVersion: languageOptions?.parserOptions?.ecmaVersion ?? 2022,
                    sourceType: languageOptions?.parserOptions?.sourceType ?? 'module',
                },
            },
            linterOptions: {
                reportUnusedDisableDirectives: linterOptions?.reportUnusedDisableDirectives ?? 'warn',
            }
        },
        {
            name: 'gaonengwww/javascript/rules',
            plugins: plugins ?? {},
            rules: {
                'constructor-super': ['error'],
                'for-direction': ['error'],
                'getter-return': ['error', { "allowImplicit": true }],
                'no-async-promise-executor': ['error'],
                'no-class-assign': ['error'],
                'no-compare-neg-zero': ['error'],
                'no-cond-assign': ['error'],
                'no-const-assign': ['error'],
                'no-dupe-args': ['error'],
                'no-dupe-class-members': ['error'],
                'no-dupe-else-if': ['error'],
                'no-dupe-keys': ['error'],
                'no-duplicate-case': ['error'],
                'no-empty-character-class': ['warn'],
                'no-ex-assign': ['warn'],
                'no-fallthrough': ['off'],
                'no-func-assign': ['error'],
                'no-import-assign': ['error'],
                'no-inner-declarations': ['error'],
                'no-invalid-regexp': ["error", { "allowConstructorFlags": ["a", "z"] }],
                'no-irregular-whitespace': ['off'],
                'no-loss-of-precision': ['warn'],
                'no-misleading-character-class': ['off'],
                'no-new-symbol': ['error'],
                'no-obj-calls': ['error'],
                'no-promise-executor-return': ["error", { allowVoid: true }],
                'no-setter-return': ['error'],
                'no-sparse-arrays': ['error'],
                'no-this-before-super': ['error'],
                'no-undef': ['off'],
                'no-unexpected-multiline': ['error'],
                'no-unmodified-loop-condition': ['error'],
                'no-unreachable': ['error'],
                'no-unreachable-loop': ['error'],
                'no-unsafe-finally': ['error'],
                'no-unsafe-negation': ['error'],
                'no-unsafe-optional-chaining': ['error'],
                'no-unused-vars': ['error', {
                    args: 'none',
                    caughtErrors: 'none',
                    ignoreRestSiblings: true,
                    vars: 'all',
                }],
                'no-use-before-define': ['error'],
                'no-useless-backreference': 'error',
                'no-useless-call': 'error',
                'no-useless-catch': 'error',
                'no-useless-computed-key': 'error',
                'no-useless-constructor': 'error',
                'no-useless-rename': 'error',
                'no-useless-return': 'error',
                'no-var': 'error',
                'no-with': 'error',
                'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
                'arrow-body-style': ['error', 'as-needed', {
                    requireReturnForObjectLiteral: true
                }],
                'curly': ['error', 'all'],
                'dot-notation': ['error', { "allowKeywords": false }],
                'eqeqeq': ['error'],
                'new-cap': ['error', { capIsNew: false, newIsCap: true, properties: true }],
                'no-delete-var': ['error'],
                'no-empty': ['warn'],
                'no-eval': ['error'],
                'no-extra-boolean-cast': ['error'],
                'no-extra-label': ['error'],
                'semi': ['error', 'always'],
                'brace-style': ["error", "1tbs", { "allowSingleLine": true }],
                'comma-spacing': ["error", { "before": false, "after": true }],
                'quotes': ['error', 'single'],
                'space-before-blocks': ['error'],
                'linebreak-style': ['off'],
                ...overrides,
            }
        }
    ] as Linter.Config[];
}