import { Linter } from 'eslint';
import { javascript } from './rules';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';
import { vue } from './rules/vue';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { typescript } from './rules/typescript';
import { isPackageExists } from 'local-pkg';
import { ParserOptions } from '@typescript-eslint/parser';
import { ignore } from './rules/ignore';
import { stylistic, StylisticOptions } from './rules/stylistic';
import { ConfigNames, OptionsConfig, OptionsOverrides, TypedFlatConfigItem } from './type';
import { yaml } from './rules/yaml';
import { getOverrides, isInEditorEnv, resolveSubOptions } from './utils';
import { unocss } from './rules/unocss';


export type Awaitable<T> = T | Promise<T>;

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
];

export const www = (
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> => {
  const {
    javascript: enableJavascript = true,
    vue: enableVue = VuePackages.some(p => isPackageExists(p)),
    typescript: enableTypescript = isPackageExists('typescript'),
    // ignore: enableIgnore = true,
    stylistic: enableStylistic = true,
    yaml: enableYaml = true,
    unocss: enableUnocss = false,
    componentExts,
  } = options;
  let isInEditor = options.isInEditor;
  if (isInEditor === null) {
    isInEditor = isInEditorEnv();
  }
  const config: Awaitable<Linter.Config[]>[] = [];
  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};
  const typescriptOptions = resolveSubOptions(options, 'typescript');
  config.push(
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'overrides'),
    }),
  );
  if (enableYaml) {
    config.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
        stylistic: stylisticOptions,
      }),
    );
  }
  if (enableVue) {
    componentExts.push('vue');
  }
  if (enableTypescript) {
    config.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, 'typescript'),
      type: options.type,
    }));
  }
  if (stylisticOptions) {
    config.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }));
  }
  if (enableUnocss) {
    config.push(
      unocss(resolveSubOptions(options, 'unocss')),
    );
  }
  const composer = new FlatConfigComposer();
  composer.append(
    ...config,
  );
  composer.renamePlugins({
    '@eslint-react': 'react',
    '@eslint-react/dom': 'react-dom',
    '@eslint-react/hooks-extra': 'react-hooks-extra',
    '@eslint-react/naming-convention': 'react-naming-convention',

    '@stylistic': 'style',
    '@typescript-eslint': 'ts',
    'import-x': 'import',
    'n': 'node',
    'vitest': 'test',
    'yml': 'yaml',
  });
  return composer;
};
