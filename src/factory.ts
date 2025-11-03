import { Linter } from 'eslint';
import { javascript } from './rules';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { typescript } from './rules/typescript';
import { isPackageExists } from 'local-pkg';
import { stylistic } from './rules/stylistic';
import { ConfigNames, OptionsConfig, TypedFlatConfigItem } from './type';
import { yaml } from './rules/yaml';
import { getOverrides, interopDefault, isInEditorEnv, resolveSubOptions } from './utils';
import { unocss } from './rules/unocss';
import { jsonc } from './rules/json';
import { toml } from './rules/toml';
import { ignore } from './rules/ignore';
import { vue } from './rules/vue';
import { react } from './rules/react';
import { nextjs } from './rules/nextjs';

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
    gitIgnore: enableGitignore = true,
    vue: enableVue = VuePackages.some(p => isPackageExists(p)),
    typescript: enableTypescript = isPackageExists('typescript'),
    yaml: enableYaml = true,
    unocss: enableUnocss = false,
    json: enableJson = false,
    toml: enableToml = false,
    react: enableReact = false,
    nextjs: enableNext = false,
    componentExts = [],
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
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;
  config.push(
    ignore(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'overrides'),
    }),
  );
  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      config.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'antfu/gitignore',
        ...enableGitignore,
      })]));
    } else {
      config.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'antfu/gitignore',
        strict: false,
      })]));
    }
  }
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

  if (enableVue) {
    config.push(vue({
      ...resolveSubOptions(options, 'vue'),
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypescript,
    }));
  }

  if (enableReact) {
    config.push(
      react({
        ...typescriptOptions,
        overrides: getOverrides(options, 'react'),
        tsconfigPath,
      }),
    );
  }

  if (enableNext) {
    config.push(nextjs({
      overrides: getOverrides(options, 'nextjs'),
    }));
  }

  if (enableUnocss) {
    config.push(
      unocss(resolveSubOptions(options, 'unocss')),
    );
  }
  if (enableJson) {
    config.push(
      jsonc(resolveSubOptions(options, 'json')),
    );
  }
  if (enableToml) {
    config.push(toml(resolveSubOptions(options, 'toml')));
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
