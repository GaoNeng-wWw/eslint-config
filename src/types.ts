import globals from 'globals';
import type { ESLint, Linter } from 'eslint'
import {ParserOptions} from '@typescript-eslint/parser';

export type Awaitable<T> = T | Promise<T>
export type TypedFlatConfigItem = Omit<Linter.FlatConfig<Linter.RulesRecord>, 'plugins'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>
}
export type Options = {
  overrides?: Record<string, any>;
  files?: string[];
  ignores?: string[];
}

export type JavascriptOptions = {} & Options;

export type TypescriptOptions = {
  tsconfig?: string[]
  parserOptions?: Partial<ParserOptions>
  filesTypeAware?: string[];
  componentExts?: string[];
} & Options;

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsConfig extends OptionsComponentExts {
  typescript?: TypescriptOptions | boolean
  javascript?: JavascriptOptions | boolean
  overrides?: {
    typescript?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
  }
}