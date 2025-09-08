import { Linter } from 'eslint';
import { RuleOptions, ConfigNames } from './typegen';
import { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import { ParserOptions } from '@typescript-eslint/parser';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';

export type Awaitable<T> = T | Promise<T>;

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions;
export type { ConfigNames };

export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
};
export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}
export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}
export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}
export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}
export type OptionsComponentExts = {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
};
export interface OptionsIsInEditor {
  isInEditor?: boolean
};
export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib'
}
export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}
export type OptionsTypescript
  = (OptionsTypeScriptWithTypes & OptionsOverrides)
    | (OptionsTypeScriptParserOptions & OptionsOverrides);
export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}
export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}
export interface OptionVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions

  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3
}
export type OptionsConfig = {
  javascript?: OptionsOverrides
  yaml?: boolean | OptionsOverrides
  typescript?: boolean | OptionsTypescript
  vue?: boolean | OptionVue
  stylistic?: boolean | (StylisticConfig & OptionsOverrides)
  unocss?: boolean | OptionsUnoCSS
  isInEditor?: boolean
  overrides?: {
    yaml?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
  }
} & OptionsComponentExts & OptionsProjectType;
