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

// export type Override = Record<string, any>;
// export type Option<T = object> = {
//   override?: Override;
//   enable?: boolean;
//   option?: T;
// };
// export interface VueOptions {
//   override?: Record<string, any>;
//   files?: string;
//   typescript?: boolean;
//   sfcBlocks?: boolean | VueBlocksOptions;
//   vueVersion?: number;
//   enable?: boolean;
//   indent?: number;
//   stylistic?: boolean;
// }
// export type TypescriptOptions = {
//   files?: string[];
//   overrides?: TypedFlatConfigItem['rules'];
//   type?: 'app' | 'lib';
//   enable?: boolean;
//   tsconfigPath?: string;
//   parserOptions?: ParserOptions;
//   componentExts?: string[];
//   filesTypeAware?: string[];
//   ignoresTypeAware?: string[];
// };
// export interface Options {
//   javascript?: Option<{
//     languageOptions?: Linter.Config['languageOptions'];
//     linterOptions?: Linter.Config['linterOptions'];
//     plugins?: Linter.Config['plugins'][];
//   }>;
//   vue?: VueOptions;
//   typescript?: TypescriptOptions;
//   ignore?: {
//     userIgnore?: string[];
//   };
//   stylistic?: StylisticOptions;
//   yaml?: boolean | OptionsOverrides;
// }

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
    componentExts,
  } = options;
  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
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
