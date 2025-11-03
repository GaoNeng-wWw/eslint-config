import stylisticPlugin from '@stylistic/eslint-plugin';
import { OptionsOverrides, StylisticConfig } from '../type';

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
}

export const stylistic = (
  options: StylisticOptions = {},
) => {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };
  const baseRule = stylisticPlugin.configs.customize({
    indent,
    jsx,
    quotes,
    semi,
    braceStyle: '1tbs',
  });
  return [
    {
      name: 'gaonengwww/stylistic',
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

        ...overrides,
      },
    },
  ] as any;
};
