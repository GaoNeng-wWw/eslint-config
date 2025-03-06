import { Linter } from 'eslint';
import { mergeProcessors } from 'eslint-merge-processors';
import { VueOptions } from '../factory';

export const vue = async (options: VueOptions = {}) => {
  const {
    files = ['./**/*.vue'],
    override = {},
    vueVersion = 3,
    indent = 2,
    stylistic = true,
  } = options;
  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {};
  const [
    pluginVue,
    vueParser,
    vueBlocks,
  ] = await Promise.all([
    (await import('eslint-plugin-vue')).default,
    (await import('vue-eslint-parser')).default,
    (await import('eslint-processor-vue-blocks')).default,
  ]);

  return [
    {
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      name: 'vue/setup',
      plugins: {
        vue: pluginVue,
      },
    },
    {
      files,
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? (await import('@typescript-eslint/parser')).default
            : null,
          sourceType: 'module',
        },
      },
      name: 'vue/rules',
      processor: sfcBlocks === false
        ? pluginVue.processors.vue
        : mergeProcessors([
          pluginVue.processors.vue,
          vueBlocks({
            ...sfcBlocks,
            blocks: {
              styles: true,
              ...sfcBlocks.blocks,
            },
          }),
        ]),
      rules: {
        ...pluginVue.configs.base.rules,
        ...vueVersion === 2
          ? {
            ...pluginVue.configs.essential.rules as any,
            ...pluginVue.configs['strongly-recommended'].rules as any,
            ...pluginVue.configs.recommended.rules as any,
          }
          : {
            ...pluginVue.configs.essential.rules as any,
            ...pluginVue.configs['strongly-recommended'].rules as any,
            ...pluginVue.configs.recommended.rules as any,
          },
        'vue/multi-word-component-names': 0,
        'vue/no-v-html': 'off',
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/component-options-name-casing': ['error', 'kebab-case'],
        'vue/component-tags-order': ['off'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
          },
        ],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

        ...stylistic
          ? {
            'vue/array-bracket-spacing': ['error', 'never'],
            'vue/arrow-spacing': ['error', { after: true, before: true }],
            'vue/block-spacing': ['error', 'always'],
            'vue/block-tag-newline': ['error', {
              multiline: 'always',
              singleline: 'always',
            }],
            'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
            'vue/comma-dangle': ['error', 'always-multiline'],
            'vue/comma-spacing': ['error', { after: true, before: false }],
            'vue/comma-style': ['error', 'last'],
            'vue/html-comment-content-spacing': ['error', 'always', {
              exceptions: ['-'],
            }],
            'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
            'vue/keyword-spacing': ['error', { after: true, before: true }],
            'vue/object-curly-newline': 'off',
            'vue/object-curly-spacing': ['error', 'always'],
            'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
            'vue/operator-linebreak': ['error', 'before'],
            'vue/padding-line-between-blocks': ['error', 'always'],
            'vue/quote-props': ['error', 'consistent-as-needed'],
            'vue/space-in-parens': ['error', 'never'],
            'vue/template-curly-spacing': 'error',
          }
          : {},
        ...override,
      },
    },
  ] as Linter.Config[];
};
