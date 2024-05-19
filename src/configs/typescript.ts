import typegen from 'eslint-typegen';
import { TypedFlatConfigItem, TypescriptOptions } from '../types';
import { GLOB_SRC, GLOB_TS, GLOB_TSX } from '../glob';
import { interopDefault, renameRules, toArray } from '../utils';
export async function typescript(
  options: TypescriptOptions = {
    overrides: {},
    ignores: [],
  }
): Promise<TypedFlatConfigItem[]>{
  const {
    overrides,
    componentExts=[],
    parserOptions={},
    ignores
  } = options;
  const files = options.files ?? [
    GLOB_SRC,
    ...componentExts.map(ext => `**/*.${ext}`),
  ]
  const tsConfigPath = options.tsconfig ? toArray(options.tsconfig) : null;
  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]

  const isTypeAware = !!tsConfigPath;

  const [
    pluginTs,
    parserTs,
  ] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const)

  const typeAwareRules:TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'no-throw-literal': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-throw-literal': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/unbound-method': 'error',
    ...overrides
  };

  const useParser = (
    typeAware: boolean,
    files: string[],
    ignores?: string[]
  ) => {
    return {
      files,
      ...ignores ? {ignores} : {},
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          sourceType: 'module',
          ...typeAware
            ? {
                project: tsConfigPath,
                tsconfigRootDir: process.cwd(),
              }
            : {},
          ...parserOptions as any,
        },
      },
      name: `gaonengwww/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
    }
    }
  
  return [
    {
      name: 'gaonengwww/typescript/setup',
      plugins: {
        ts: pluginTs
      }
    },
    ...isTypeAware ? [useParser(true, filesTypeAware), useParser(false,filesTypeAware, ignores)] : [useParser(false, files)],
    {
      files,
      name: 'gaonengwww/typescript/rules',
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          { '@typescript-eslint': 'ts' },
        ),
        ...renameRules(
          pluginTs.configs.strict.rules!,
          { '@typescript-eslint': 'ts' },
        ),
        'no-new-symbol': 'off',
        'no-new-native-nonconstructor': 'error',
        'no-dupe-class-members': 'off',
        'no-loss-of-precision': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        'ts/ban-types': ['error', { types: { Function: false } }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': ['error', { disallowTypeAnnotations: false, prefer: 'type-imports' }],
        'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        'ts/no-dupe-class-members': 'error',
        'ts/no-dynamic-delete': 'off',
        'ts/no-explicit-any': 'off',
        'ts/no-extraneous-class': 'off',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-invalid-void-type': 'off',
        'ts/no-loss-of-precision': 'error',
        'ts/no-non-null-assertion': 'off',
        'ts/no-redeclare': 'error',
        'ts/no-require-imports': 'error',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'ts/no-useless-constructor': 'off',
        'ts/prefer-ts-expect-error': 'error',
        'ts/triple-slash-reference': 'off',
        'ts/unified-signatures': 'off',
        'ts/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow-as-parameter' }],
      }
    },
    ...isTypeAware
    ? [{
        files: filesTypeAware,
        name: 'gaonengwww/typescript/rules-type-aware',
        rules: {
          ...tsConfigPath ? typeAwareRules : {},
          ...overrides,
        },
      }]
    : [],
    {
      files: ['**/*.d.ts'],
      name: 'gaonengwww/typescript/disables-dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      name: 'gaonengwww/typescript/disables-test',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'gaonengwww/typescript/disables-cjs',
      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-var-requires': 'off',
      },
    },
  ]
}