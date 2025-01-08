import { Linter } from 'eslint';
import { mergeProcessors } from 'eslint-merge-processors';
import { VueOptions } from '../factory';

export const vue = async (options: VueOptions = {}) => {
  const {
    files = ['./**/*.vue'],
    override = {},
    vueVersion = 3,
  } = options;
  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {};
  const [
    pluginVue,
    vueParser,
    vueBlocks,
  ] = await Promise.all([
    (await import('eslint-plugin-vue'))['default'],
    (await import('vue-eslint-parser'))['default'],
    (await import('eslint-processor-vue-blocks'))['default'],
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
            ? (await import('@typescript-eslint/parser'))['default']
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
        ...override,
      },
    },
  ] as Linter.Config[];
};
