import { Linter } from 'eslint';
import stylisticPlugin, { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import { Option, Override } from '../factory';

export interface StylisticOptions extends StylisticCustomizeOptions, Option {}

export const stylistic = (
  opts: StylisticOptions = {},
) => {
  const { override = {} } = opts;
  const baseRule = stylisticPlugin.configs.customize({ semi: true, indent: 2 });
  return [
    {
      plugins: {
        '@stylistic': stylisticPlugin,
      },
      rules: {
        ...baseRule.rules,
        '@stylistic/indent': ['error', 2],
        '@stylistic/quotes': ['error', 'single'],
        '@stylistic/semi': ['error', 'always'],
        '@stylistic/arrow-spacing': ['error', { after: true, before: true }],
        '@stylistic/block-spacing': ['error', 'always'],
        ...override,
      },
    },
  ] as any;
};
